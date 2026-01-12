import {
  BaseEdge,
  type EdgeProps,
  getBezierPath,
  getSimpleBezierPath,
  type InternalNode,
  type Node,
  Position,
  useInternalNode,
} from "@xyflow/react";
import { useAtomValue } from "jotai";
import { edgeAnimationModeAtom } from "@/lib/workflow-store";

const Temporary = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  selected,
}: EdgeProps) => {
  const [edgePath] = getSimpleBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Temporary edges (being drawn) use a more vibrant color
  return (
    <BaseEdge
      className="stroke-1 temporary-edge"
      id={id}
      path={edgePath}
      style={{
        stroke: selected
          ? "var(--primary)"
          : "var(--primary)", // Vibrant primary color when drawing
        strokeDasharray: "5, 5",
        strokeWidth: 2.5,
        opacity: 0.8,
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

  if (!(sourceNode && targetNode)) {
    return null;
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

  // Different styles based on animation mode
  const getAnimationClass = () => {
    switch (animationMode) {
      case "flowing-dots":
        return "animated-edge-flowing-dots";
      case "dashed-flow":
        return "animated-edge-dashed-flow";
      case "solid-pulse":
        return "animated-edge-solid-pulse";
      default:
        return "animated-edge-flowing-dots";
    }
  };

  const getStrokeDashArray = () => {
    switch (animationMode) {
      case "flowing-dots":
        return "3 9"; // Dots with spacing
      case "dashed-flow":
        return "8 4";
      case "solid-pulse":
        return "none";
      default:
        return "8 4";
    }
  };

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      className={getAnimationClass()}
      style={{
        ...style,
        stroke: selected
          ? "var(--primary)"
          : "color-mix(in oklch, var(--foreground) 50%, transparent)",
        strokeWidth: animationMode === "solid-pulse" ? 3 : 2.5,
        strokeDasharray: getStrokeDashArray(),
        strokeLinecap: "round",
      }}
    />
  );
};

export const Edge = {
  Temporary,
  Animated,
};
