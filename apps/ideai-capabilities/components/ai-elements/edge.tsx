import {
  BaseEdge,
  type EdgeProps,
  getBezierPath,
  getSimpleBezierPath,
  type InternalNode,
  type Node,
  Position,
  useInternalNode,
  useNodes,
  useReactFlow,
} from "@xyflow/react";
import { useAtomValue } from "jotai";
import { edgeAnimationModeAtom, executionLogsAtom } from "@/lib/workflow-store";

const Temporary = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
  source,
  target,
}: EdgeProps) => {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Check if edge has been successfully traversed (temporary edges during execution)
  // Use useNodes hook to get reactive node status updates
  const executionLogs = useAtomValue(executionLogsAtom);
  const nodes = useNodes(); // Get all nodes for reactive status updates
  
  // Get current node status from nodes array (most up-to-date)
  const sourceNodeFromStore = source ? nodes.find((n) => n.id === source) : undefined;
  const targetNodeFromStore = target ? nodes.find((n) => n.id === target) : undefined;
  
  const sourceLog = source ? executionLogs[source] : undefined;
  const targetLog = target ? executionLogs[target] : undefined;
  
  // Check both execution logs and node data status (prioritize reactive nodes array)
  const sourceStatus =
    sourceLog?.status ||
    (sourceNodeFromStore?.data?.status as string | undefined);
  const targetStatus =
    targetLog?.status ||
    (targetNodeFromStore?.data?.status as string | undefined);
  
  // Edge is successfully traversed when source succeeded and target has started/succeeded
  const isSuccessfullyTraversed =
    sourceStatus === "success" &&
    (targetStatus === "running" || targetStatus === "success");

  // Green color and thicker stroke when successfully traversed
  const strokeColor = isSuccessfullyTraversed
    ? "#22c55e" // Green for successful traversal
    : selected
      ? "#8b949e" // Muted foreground - visible on dark
      : "#d0d7de"; // Border - visible on dark background

  const strokeWidth = isSuccessfullyTraversed ? 3.5 : 2; // Thicker when successfully traversed
  // Use longer dashes (10px) for successful edges, dots for normal edges
  const strokeDasharray = isSuccessfullyTraversed ? "10, 4" : "5, 5";

  return (
    <BaseEdge
      className="stroke-1"
      id={id}
      path={edgePath}
      style={{
        stroke: strokeColor,
        strokeWidth,
        strokeDasharray,
        fill: "none",
      }}
    />
  );
};

const getHandleCoordsByPosition = (
  node: InternalNode<Node>,
  handlePosition: Position,
) => {
  // Choose the handle type based on position - Left is for target, Right is for source
  const handleType = handlePosition === Position.Left ? "target" : "source";

  const handle = node.internals.handleBounds?.[handleType]?.find(
    (h) => h.position === handlePosition,
  );

  if (!handle) {
    return [0, 0] as const;
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

  // this is a tiny detail to make the markerEnd of an edge visible.
  // The handle position that gets calculated has the origin top-left, so depending which side we are using, we add a little offset
  // when the handlePosition is Position.Right for example, we need to add an offset as big as the handle itself in order to get the correct position
  switch (handlePosition) {
    case Position.Left:
      offsetX = 0;
      break;
    case Position.Right:
      offsetX = handle.width;
      break;
    case Position.Top:
      offsetY = 0;
      break;
    case Position.Bottom:
      offsetY = handle.height;
      break;
    default:
      throw new Error(`Invalid handle position: ${handlePosition}`);
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y] as const;
};

const getEdgeParams = (
  source: InternalNode<Node>,
  target: InternalNode<Node>,
) => {
  const sourcePos = Position.Right;
  const [sx, sy] = getHandleCoordsByPosition(source, sourcePos);
  const targetPos = Position.Left;
  const [tx, ty] = getHandleCoordsByPosition(target, targetPos);

  return {
    sx,
    sy,
    tx,
    ty,
    sourcePos,
    targetPos,
  };
};

const Animated = ({ id, source, target, style, selected }: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const animationMode = useAtomValue(edgeAnimationModeAtom);
  const executionLogs = useAtomValue(executionLogsAtom);
  const nodes = useNodes(); // Get all nodes for reactive status updates

  if (!(sourceNode && targetNode)) {
    return null;
  }

  // Get current node status from nodes array (most up-to-date)
  const sourceNodeFromStore = nodes.find((n) => n.id === source);
  const targetNodeFromStore = nodes.find((n) => n.id === target);

  // Check if edge has been successfully traversed
  // Check executionLogsAtom first, then node.data.status (from reactive nodes array)
  const sourceLog = executionLogs[source];
  const targetLog = executionLogs[target];
  const sourceStatus =
    sourceLog?.status ||
    (sourceNodeFromStore?.data?.status as string | undefined) ||
    (sourceNode.data?.status as string | undefined);
  const targetStatus =
    targetLog?.status ||
    (targetNodeFromStore?.data?.status as string | undefined) ||
    (targetNode.data?.status as string | undefined);

  // Edge is green when: source node succeeded AND target node has started/completed
  const isSuccessfullyTraversed =
    sourceStatus === "success" &&
    (targetStatus === "running" || targetStatus === "success");

  const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(
    sourceNode,
    targetNode,
  );

  const [edgePath] = getBezierPath({
    sourceX: sx,
    sourceY: sy,
    sourcePosition: sourcePos,
    targetX: tx,
    targetY: ty,
    targetPosition: targetPos,
  });

  // Different styles based on animation mode
  const getEdgeStyles = () => {
    // For dash modes, always show green and wider for preview
    const isDashMode = animationMode === "dashed-flow";
    
    // Green color and thicker stroke when successfully traversed OR in dash preview mode
    const strokeColor =
      isSuccessfullyTraversed || isDashMode
        ? "#22c55e" // Green for successful traversal or dash preview
        : selected
          ? "#8b949e" // Muted foreground - visible on dark
          : "#d0d7de"; // Border - visible on dark background

    // Thicker when successfully traversed or in dash preview mode
    const baseStrokeWidth = isSuccessfullyTraversed || isDashMode ? 3.5 : 2;

    const baseStyle = {
      ...style,
      stroke: strokeColor,
      strokeWidth: baseStrokeWidth,
      fill: "none",
    };

    switch (animationMode) {
      case "flowing-dots":
        // Use longer dashes (10px) when successful, dots when normal
        return {
          ...baseStyle,
          strokeDasharray: isSuccessfullyTraversed ? "10 4" : "3 9",
          animation: "flowing-dots 2s linear infinite",
        };
      case "dashed-flow":
        // Always green, wider dashes (10px) for preview of successful state
        return {
          ...baseStyle,
          strokeDasharray: "10 4", // Wider dashes for preview
          animation: "dashdraw 1s linear infinite",
        };
      case "solid-pulse":
        return {
          ...baseStyle,
          strokeDasharray: "none",
          strokeWidth: isSuccessfullyTraversed ? 4 : 2.5, // Thicker when successful
          animation: "solid-pulse 1.5s ease-in-out infinite",
        };
      default:
        // Use longer dashes (10px) when successful, dots when normal
        return {
          ...baseStyle,
          strokeDasharray: isSuccessfullyTraversed ? "10 4" : 5,
          animation: "dashdraw 0.5s linear infinite",
        };
    }
  };

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={getEdgeStyles()}
    />
  );
};

export const Edge = {
  Temporary,
  Animated,
};
