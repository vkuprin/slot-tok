import { useGame } from "@/hooks/game/useGameProvider";

export default function StatsBar() {
  const { state } = useGame();

  return (
    <div className="bg-gray-800 p-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="text-white">Credits: {state.credits}</div>
        <div className="flex gap-4">
          <div className="text-green-500">Wins: {state.wins}</div>
          <div className="text-blue-500">Spins: {state.spins}</div>
          {state.currentPowerUp && (
            <div className="text-purple-500">
              Power Up: {state.currentPowerUp.type} (
              {state.currentPowerUp.value}x)
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
