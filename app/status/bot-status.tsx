"use client";
import Spinner from "@/components/spinner";
import { useWebsocket } from "@/components/websocket-context";
import React, { useEffect, useState } from "react";

enum ShardState {
  READY,
  AWAITING_ACK,
  CONNECTING,
  CONNECTED,
  LOADING
}

const BotStatus = () => {
  const websocket = useWebsocket();

  const [shards, setShards] = useState<
    { state: ShardState; lastAck: Date; ping: number }[]
  >([]);
  const [previousLogs, setPreviousLogs] = useState<string[]>([]);
  const [lastLog, setLastLog] = useState<string[]>([]);

  useEffect(() => {
    if (!websocket.connected) return;

    if (websocket.socket?.hasListeners("shard_update"))
      websocket.socket?.removeEventListener("shard_update");

    if (websocket.socket?.hasListeners("resharding"))
      websocket.socket?.removeEventListener("resharding");

    websocket.addEventListener("resharding", (shards: number) => {
      setShards(
        Array.from({ length: shards }, () => ({
          state: ShardState.LOADING,
          lastAck: new Date(0),
          ping: 0
        }))
      );
      setPreviousLogs(["Resharding..."]);
      setLastLog(Array.from({ length: shards }, () => ""));
    });

    websocket.addEventListener("shard_debug", (data: string) => {
      const shard_data: {
        shard_id: number;
        total_shards: number;
        message: string;
        type: number;
        ping: number;
      } = JSON.parse(data);

      if (shards.length !== shard_data.total_shards) {
        setShards(
          Array.from({ length: shard_data.total_shards }, () => ({
            state: ShardState.LOADING,
            lastAck: new Date(0),
            ping: 0
          }))
        );
        return;
      }

      setPreviousLogs((prev) => {
        let updated = [...prev];
        updated.unshift(
          `[${new Date(Date.now())
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date(Date.now())
            .getMinutes()
            .toString()
            .padStart(2, "0")}][${
            shard_data.type == 1 ? "ERROR" : "DEBUG"
          }][Shard ${shard_data.shard_id
            .toString()
            .padStart((shard_data.total_shards - 1).toString().length, "0")}] ${
            shard_data.message
          }`
        );
        updated = updated.slice(0, 20);
        return updated;
      });

      setLastLog((prev) => {
        const updated = [...prev];
        updated[shard_data.shard_id] = shard_data.message;
        return updated;
      });

      const shard_index = shard_data.shard_id;

      if (shard_data.message.toLowerCase().includes("sending")) {
        setShards((prev) => {
          const updated = [...prev];
          updated[shard_index] = {
            state: ShardState.AWAITING_ACK,
            lastAck: prev[shard_index].lastAck,
            ping: shard_data.ping
          };
          return updated;
        });
      } else if (shard_data.message.toLowerCase().includes("recieved")) {
        setShards((prev) => {
          const updated = [...prev];
          updated[shard_index] = {
            state: ShardState.READY,
            lastAck: new Date(),
            ping: shard_data.ping
          };
          return updated;
        });
      } else if (
        shard_data.message.toLowerCase().includes("fetching") ||
        shard_data.message.toLowerCase().includes("connecting")
      ) {
        setShards((prev) => {
          const updated = [...prev];
          updated[shard_index] = {
            state: ShardState.CONNECTING,
            lastAck: prev[shard_index].lastAck,
            ping: shard_data.ping
          };
          return updated;
        });
      } else if (shard_data.message.toLowerCase().includes("connected")) {
        setShards((prev) => {
          const updated = [...prev];
          updated[shard_index] = {
            state: ShardState.CONNECTED,
            lastAck: prev[shard_index].lastAck,
            ping: shard_data.ping
          };
          return updated;
        });
      }
    });

    return () => {
      websocket.socket?.removeEventListener("shard_debug");
    };
  }, [websocket.connected, shards]);

  if (!websocket.connected)
    return (
      <div className="w-full mt-10">
        <Spinner />
      </div>
    );

  return (
    <div className="flex flex-row justify-center px-10 mt-5">
      <div className="w-2/3 flex flex-col gap-2 px-5">
        <div>
          <h1 className="text-[2.5vh]">Shards</h1>
        </div>
        <div className="w-full flex flex-col gap-1">
          <div className="flex flex-row w-full items-center">
            <p className="w-1/6 text-center">Shard ID</p>
            <p className="w-1/6 text-center">Status</p>
            <p className="w-1/6 text-center">Ping</p>
            <p className="w-1/6 text-center">Last Ack (s)</p>
            <p className="w-2/6 text-center">Last Log</p>
          </div>
          {shards.length === 0 ? (
            <div className="w-full text-center text-secondary">
              Waiting for shards...
            </div>
          ) : (
            shards.map((shard, index) => {
              return (
                <div
                  className="w-full p-1 items-center flex flex-row"
                  key={index}
                >
                  <p className="text-center w-1/6 font-mono font-semibold">
                    {index
                      .toString()
                      .padStart((shards.length - 1).toString().length, "0")}
                  </p>
                  <p className="w-1/6 text-center font-mono">
                    {ShardState[shard.state]}
                  </p>
                  <p className="w-1/6 text-center font-mono">
                    {Math.round(shard.ping == -1 ? 0 : shard.ping)
                      .toString()
                      .padStart(3, "0")}
                  </p>
                  <p className="w-1/6 text-center font-mono">
                    {shard.lastAck.getTime() != 0
                      ? Math.round(
                          (Date.now() - shard.lastAck.getTime()) / 1000
                        )
                          .toString()
                          .padStart(5, "0")
                      : "NEVER"}
                  </p>
                  <p className="w-2/6 font-mono text-center">
                    {lastLog[index]}
                  </p>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="border-l-2 border-custom"></div>
      <div className="w-1/3 flex flex-col gap-2 px-5">
        <div>
          <h1 className="text-[2.5vh]">Feed</h1>
          <div className="flex flex-col">
            {previousLogs.length === 0 ? (
              <div className="text-secondary text-center">No logs yet...</div>
            ) : (
              previousLogs.map((log, index) => (
                <p
                  key={index}
                  className="text-[1.5vh] font-mono text-secondary"
                >
                  {log}
                </p>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotStatus;
