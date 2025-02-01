"use client";

import { useRouter, useSearchParams } from "next/navigation";

// export default function Space() {



//     return <div>
//         <h1> spaceId : {spaceId}</h1>
//     </div>
// }

import React, { useState, useEffect, useRef } from 'react';

// Matching the server's Action enum
enum Action {
  JOIN = "join",
  MOVE = "move"
}

// Matching server interfaces
interface JoinMessage {
  action: string;
  spaceId: string | null ;
  token: string;
}

interface MoveMessage {
  action: Action.MOVE;
  spaceId: string | null;
  x: number;
  y: number;
}

interface Player {
  x: number;
  y: number;
  // Add other player properties as needed
}

const MetaverseSpace = ({ spaceId, token }: { spaceId: string, token: string }) => {
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState<Player[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const router = useRouter()
  const param = useSearchParams()
  
 

  useEffect(() => {
    wsRef.current = new WebSocket('ws://localhost:8080'); // Adjust port as needed
    // Create WebSocket connection
    if(!wsRef.current){
      console.log("no socket detected")
      return;
    }
   

    wsRef.current.onopen = () => {
      console.log('Connected to server');
      setConnected(true);
    };

    wsRef.current.addEventListener('open', () => {
      const joinMessage = {
        action: Action.JOIN,
        spaceId: param.get('spaceId'),
        token: token
      };
      wsRef.current?.send(JSON.stringify(joinMessage));
      console.log('Join message sent');
    });

    wsRef.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        
        // Handle different message types
        if ( message === 'Space joined') {
          setPlayers(prevPlayers => [...prevPlayers, {
            x: 400,
            y: 300
          }]);
        } else if (message.action === Action.MOVE) {
          // Handle movement updates
          // Simply update player position
      setPlayers([{
        x: message.x,
        y: message.y
      }]);
      console.log('Player moved to:', message.x, message.y);
        } else {
            console.log(message)
        }
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    };

    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    wsRef.current.onclose = () => {
      console.log('Disconnected from server');
      setConnected(false);
    };

    // Cleanup on unmount
    // return () => {
    //   wsRef.current?.close();
    // };

  }, [spaceId, token]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#f0f0f0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw players
    players.forEach(player => {
      ctx.fillStyle = '#ff0000';
      ctx.beginPath();
      ctx.arc(player.x, player.y, 20, 0, Math.PI * 2);
      ctx.fill();
    });
  }, [players]);

  const handleMovement = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Send movement message matching server interface
    const moveMessage: MoveMessage = {
      action: Action.MOVE,
      spaceId: param.get('spaceId'),
      x: x,
      y: y
    };

    wsRef.current.send(JSON.stringify(moveMessage));
  };

  return (
    <div className="space-container">
      <div className="status">
        Connection Status: {connected ? 'Connected' : 'Disconnected'}
      </div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        onClick={handleMovement}
        className="border border-gray-300 rounded-lg"
      />
    </div>
  );
};

export default MetaverseSpace;