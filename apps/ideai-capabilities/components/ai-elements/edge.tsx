/**
 * @fileoverview Edge components for workflow canvas
 * @module Edge
 * @description
 * Clean edge rendering with configurable style presets.
 * Supports temporary edges (during drag) and animated edges (on canvas).
 */

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
import { edgeStylePresetAtom, executionLogsAtom } from "@/lib/workflow-store";
import { getEdgeStyle, type EdgeState } from "@/lib/edge-styles";

/**
 * Temporary edge shown during connection drag
 */
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

  const executionLogs = useAtomValue(executionLogsAtom);
  const nodes = useNodes();
  const preset = useAtomValue(edgeStylePresetAtom);

  const sourceNodeFromStore = source
    ? nodes.find((n) => n.id === source)
    : undefined;
  const targetNodeFromStore = target
    ? nodes.find((n) => n.id === target)
    : undefined;

  const sourceLog = source ? executionLogs[source] : undefined;
  const targetLog = target ? executionLogs[target] : undefined;

  const sourceStatus =
    sourceLog?.status ||
    (sourceNodeFromStore?.data?.status as string | undefined);
  const targetStatus =
    targetLog?.status ||
    (targetNodeFromStore?.data?.status as string | undefined);

  // Determine edge state: success, error, or normal
  let edgeState: EdgeState = "normal";

  // Green: Source succeeded AND target has started/succeeded
  if (
    sourceStatus === "success" &&
    (targetStatus === "running" || targetStatus === "success")
  ) {
    edgeState = "success";
  }
  // Red: Source or target has error (can't run)
  else if (sourceStatus === "error" || targetStatus === "error") {
    edgeState = "error";
  }

  const style = getEdgeStyle(preset, edgeState, selected);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        stroke: style.stroke,
        strokeWidth: style.strokeWidth,
        strokeDasharray: style.strokeDasharray,
        fill: "none",
      }}
      className={style.className}
    />
  );
};

/**
 * Get handle coordinates by position for edge connection
 */
const getHandleCoordsByPosition = (
  node: InternalNode<Node>,
  handlePosition: Position,
) => {
  const handleType =
    handlePosition === Position.Left ? "target" : "source";

  const handle = node.internals.handleBounds?.[handleType]?.find(
    (h) => h.position === handlePosition,
  );

  if (!handle) {
    return [0, 0] as const;
  }

  let offsetX = handle.width / 2;
  let offsetY = handle.height / 2;

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
  }

  const x = node.internals.positionAbsolute.x + handle.x + offsetX;
  const y = node.internals.positionAbsolute.y + handle.y + offsetY;

  return [x, y] as const;
};

/**
 * Get edge path parameters from source and target nodes
 */
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

/**
 * Animated edge component with style presets
 */
const Animated = ({ id, source, target, style, selected }: EdgeProps) => {
  const sourceNode = useInternalNode(source);
  const targetNode = useInternalNode(target);
  const preset = useAtomValue(edgeStylePresetAtom);
  const executionLogs = useAtomValue(executionLogsAtom);
  const nodes = useNodes();

  if (!(sourceNode && targetNode)) {
    return null;
  }

  const sourceNodeFromStore = nodes.find((n) => n.id === source);
  const targetNodeFromStore = nodes.find((n) => n.id === target);

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

  // Determine edge state: success, error, or normal
  let edgeState: EdgeState = "normal";

  // Green: Source succeeded AND target has started/succeeded
  if (
    sourceStatus === "success" &&
    (targetStatus === "running" || targetStatus === "success")
  ) {
    edgeState = "success";
  }
  // Red: Source or target has error (can't run)
  else if (sourceStatus === "error" || targetStatus === "error") {
    edgeState = "error";
  }

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

  const edgeStyle = getEdgeStyle(preset, edgeState, selected);

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      style={{
        ...style,
        stroke: edgeStyle.stroke,
        strokeWidth: edgeStyle.strokeWidth,
        strokeDasharray: edgeStyle.strokeDasharray,
        fill: "none",
        animation: edgeStyle.animation,
      }}
      className={edgeStyle.className}
    />
  );
};

export const Edge = {
  Temporary,
  Animated,
};
