import React, { useEffect, useRef, useState } from 'react';
import { DecisionTreeNode } from '../types';

interface TreeVisualizationProps {
  tree: DecisionTreeNode;
}

const nodeWidth = 200;
const nodeHeight = 100;
const horizontalSpacing = 60;
const verticalSpacing = 50;

const TreeVisualization: React.FC<TreeVisualizationProps> = ({ tree }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [svgDimensions, setSvgDimensions] = useState({ width: 800, height: 600 });
  const [zoomLevel, setZoomLevel] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Calculate tree depth and width
  const calculateTreeDimensions = (node: DecisionTreeNode): { depth: number; width: number } => {
    if (!node) return { depth: 0, width: 0 };
    
    if (node.isLeaf) {
      return { depth: 1, width: 1 };
    }
    
    if (node.left && node.right) {
      const leftDim = calculateTreeDimensions(node.left);
      const rightDim = calculateTreeDimensions(node.right);
      return { 
        depth: Math.max(leftDim.depth, rightDim.depth) + 1,
        width: leftDim.width + rightDim.width
      };
    }
    
    if (node.branches) {
      const branchDims = Object.values(node.branches).map(calculateTreeDimensions);
      const maxDepth = Math.max(...branchDims.map(dim => dim.depth));
      const totalWidth = branchDims.reduce((sum, dim) => sum + dim.width, 0);
      return { depth: maxDepth + 1, width: Math.max(1, totalWidth) };
    }
    
    return { depth: 1, width: 1 };
  };
  
  // Recursively render tree nodes
  const renderTreeNode = (
    node: DecisionTreeNode, 
    x: number, 
    y: number, 
    width: number,
    parentX?: number,
    parentY?: number
  ): JSX.Element[] => {
    if (!node) return [];
    
    const elements: JSX.Element[] = [];
    
    // Add connecting line from parent if coordinates are provided
    if (parentX !== undefined && parentY !== undefined) {
      elements.push(
        <line 
          key={`line-${x}-${y}`}
          x1={parentX}
          y1={parentY + nodeHeight / 2}
          x2={x}
          y2={y - nodeHeight / 2}
          stroke="#4B5563"
          strokeWidth="2"
          strokeDasharray="4"
        />
      );
    }
    
    // Add the node
    const isRoot = parentX === undefined && parentY === undefined;
    const backgroundColor = node.isLeaf 
      ? (node.prediction ? '#064E3B' : '#7F1D1D')
      : '#1E3A8A';
    
    // Calculate distribution bar widths if available
    let falseWidth = 0;
    let trueWidth = 0;
    
    if (node.distribution) {
      const [falseCount, trueCount] = node.distribution;
      const total = falseCount + trueCount;
      falseWidth = (falseCount / total) * (nodeWidth - 20);
      trueWidth = (trueCount / total) * (nodeWidth - 20);
    }
    
    elements.push(
      <g 
        key={`node-${x}-${y}`}
        className="transition-opacity duration-300 cursor-pointer hover:opacity-90"
      >
        <rect 
          x={x - nodeWidth / 2}
          y={y - nodeHeight / 2}
          width={nodeWidth}
          height={nodeHeight}
          rx={6}
          fill={backgroundColor}
          stroke={isRoot ? '#60A5FA' : '#374151'}
          strokeWidth={isRoot ? 2 : 1}
        />
        
        {node.isLeaf ? (
          <>
            <text 
              x={x} 
              y={y - 15} 
              textAnchor="middle" 
              fill="#E5E7EB"
              fontSize="14"
              fontWeight="500"
            >
              Prediction
            </text>
            <text 
              x={x} 
              y={y + 15} 
              textAnchor="middle" 
              fill={node.prediction ? '#34D399' : '#F87171'} 
              fontSize="16"
              fontWeight="bold"
            >
              {node.prediction ? 'Subscribe' : 'Not Subscribe'}
            </text>
          </>
        ) : (
          <>
            <text 
              x={x} 
              y={y - 25} 
              textAnchor="middle" 
              fill="#E5E7EB"
              fontSize="14"
              fontWeight="500"
            >
              {node.attribute}
            </text>
            
            {node.threshold !== undefined ? (
              <text 
                x={x} 
                y={y} 
                textAnchor="middle" 
                fill="#D1D5DB"
                fontSize="12"
              >
                {'≤'} {node.threshold}
              </text>
            ) : null}
            
            <text 
              x={x} 
              y={y + 25} 
              textAnchor="middle" 
              fill="#9CA3AF"
              fontSize="11"
            >
              Samples: {node.samples}
            </text>
          </>
        )}
        
        {/* Distribution bar */}
        {node.distribution && (
          <g>
            <rect 
              x={x - nodeWidth / 2 + 10}
              y={y + 30}
              width={falseWidth}
              height={6}
              rx={2}
              fill="#F87171"
              opacity={0.7}
            />
            <rect 
              x={x - nodeWidth / 2 + 10 + falseWidth}
              y={y + 30}
              width={trueWidth}
              height={6}
              rx={2}
              fill="#34D399"
              opacity={0.7}
            />
          </g>
        )}
      </g>
    );
    
    // Recursively render children
    if (node.left && node.right) {
      const leftWidth = calculateTreeDimensions(node.left).width;
      const rightWidth = calculateTreeDimensions(node.right).width;
      const totalWidth = leftWidth + rightWidth;
      const leftRatio = leftWidth / totalWidth;
      
      const leftX = x - width / 2 * (1 - leftRatio);
      const rightX = x + width / 2 * leftRatio;
      const childY = y + nodeHeight + verticalSpacing;
      
      elements.push(...renderTreeNode(node.left, leftX, childY, width * leftRatio, x, y));
      elements.push(...renderTreeNode(node.right, rightX, childY, width * rightRatio, x, y));
      
      // Add left/right labels
      elements.push(
        <text 
          key={`label-left-${x}-${y}`}
          x={(x + leftX) / 2 - 10}
          y={(y + childY) / 2 - 10}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="12"
          fontStyle="italic"
        >
          Yes
        </text>
      );
      
      elements.push(
        <text 
          key={`label-right-${x}-${y}`}
          x={(x + rightX) / 2 + 10}
          y={(y + childY) / 2 - 10}
          textAnchor="middle"
          fill="#9CA3AF"
          fontSize="12"
          fontStyle="italic"
        >
          No
        </text>
      );
    } else if (node.branches) {
      const branches = Object.entries(node.branches);
      
      if (branches.length > 0) {
        const branchDimensions = branches.map(([, branchNode]) => 
          calculateTreeDimensions(branchNode)
        );
        
        const totalBranchWidth = branchDimensions.reduce((sum, dim) => sum + dim.width, 0);
        let currentX = x - width / 2;
        
        branches.forEach(([value, branchNode], index) => {
          const branchWidth = (branchDimensions[index].width / totalBranchWidth) * width;
          const branchX = currentX + branchWidth / 2;
          const branchY = y + nodeHeight + verticalSpacing;
          
          elements.push(...renderTreeNode(branchNode, branchX, branchY, branchWidth, x, y));
          
          // Add branch label
          elements.push(
            <text 
              key={`label-branch-${index}-${x}-${y}`}
              x={(x + branchX) / 2}
              y={(y + branchY) / 2 - 10}
              textAnchor="middle"
              fill="#9CA3AF"
              fontSize="12"
              fontStyle="italic"
            >
              {value}
            </text>
          );
          
          currentX += branchWidth;
        });
      }
    }
    
    return elements;
  };
  
  useEffect(() => {
    if (!tree) return;
    
    const dimensions = calculateTreeDimensions(tree);
    const width = Math.max(800, dimensions.width * (nodeWidth + horizontalSpacing));
    const height = dimensions.depth * (nodeHeight + verticalSpacing) + 100;
    
    setSvgDimensions({ width, height });
  }, [tree]);
  
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;
      setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
      setDragStart({ x: e.clientX, y: e.clientY });
    }
  };
  
  const handleMouseUp = () => {
    setIsDragging(false);
  };
  
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const scaleFactor = 0.05;
    const delta = e.deltaY < 0 ? scaleFactor : -scaleFactor;
    setZoomLevel(prev => Math.max(0.5, Math.min(2, prev + delta)));
  };
  
  return (
    <div className="h-full w-full overflow-hidden relative">
      <div className="absolute top-2 right-2 bg-gray-800 rounded-lg p-2 flex items-center gap-2 z-10">
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.5, prev - 0.1))}
          className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600"
        >
          -
        </button>
        <span className="text-xs text-gray-400">{Math.round(zoomLevel * 100)}%</span>
        <button
          onClick={() => setZoomLevel(prev => Math.min(2, prev + 0.1))}
          className="w-6 h-6 flex items-center justify-center bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600"
        >
          +
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setPan({ x: 0, y: 0 });
          }}
          className="ml-1 px-2 py-1 text-xs bg-gray-700 rounded-md text-gray-300 hover:bg-gray-600"
        >
          Reset
        </button>
      </div>
      
      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-grab"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      >
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoomLevel})`}>
          {tree && renderTreeNode(
            tree, 
            svgDimensions.width / 2, 
            nodeHeight, 
            svgDimensions.width - 100
          )}
        </g>
      </svg>
    </div>
  );
};

export default TreeVisualization;