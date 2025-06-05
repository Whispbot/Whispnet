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

  useEffect(() => {
    if (!websocket.connected) return;

    if (websocket.socket?.hasListeners("shard_update"))
      websocket.socket?.removeEventListener("shard_update");

    websocket.addEventListener("shard_debug", (data: string) => {
      const shard_data: {
        shard_id: number;
        total_shards: number;
        message: string;
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
    <div className="w-1/2 mx-auto mt-10 flex flex-col gap-2">
      <div>
        <h1 className="text-[2.5vh]">Shards</h1>
      </div>
      <div className="w-full flex flex-col gap-1">
        <div className="flex flex-row w-full items-center">
          <p className="w-1/6 text-center">Shard ID</p>
          <p className="w-1/6 text-center">Status</p>
          <p className="w-1/6 text-center">Ping</p>
          <p className="w-1/6 text-center">Last Ack (s)</p>
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
                    ? Math.round((Date.now() - shard.lastAck.getTime()) / 1000)
                        .toString()
                        .padStart(5, "0")
                    : "NEVER"}
                </p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BotStatus;
