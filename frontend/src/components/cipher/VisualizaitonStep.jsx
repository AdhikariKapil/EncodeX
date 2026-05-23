import { useState } from "react";
import { ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const VisualizationStep = ({ step, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg mb-2 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-750 transition-colors flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">Step {index + 1}</span>
          <div className="flex items-center gap-2">
            <span className="text-xl font-mono bg-gray-700 px-2 py-1 rounded">
              {step.original_char}
            </span>
            <ArrowRight className="w-4 h-4 text-blue-400" />
            <span className="text-xl font-mono bg-blue-900/50 px-2 py-1 rounded text-blue-300">
              {step.new_char}
            </span>
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>
      {isExpanded && (
        <div className="px-4 py-3 bg-gray-900/50 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-400">Original Position</p>
              <p className="font-mono text-white">
                {step.original_position !== null
                  ? step.original_position
                  : "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-400">Shift Amount</p>
              <p className="font-mono text-white">{step.shift_amount}</p>
            </div>
            <div>
              <p className="text-gray-400">New Position</p>
              <p className="font-mono text-white">
                {step.new_position !== null ? step.new_position : "N/A"}
              </p>
            </div>
            <div className="col-span-2">
              <p className="text-gray-400">Formula</p>
              <p className="font-mono text-green-400">{step.formula}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisualizationStep;
