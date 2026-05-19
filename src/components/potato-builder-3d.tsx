"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, type ThreeEvent, useFrame } from "@react-three/fiber";
import {
  ContactShadows,
  Float,
  Html,
  OrbitControls,
  PerspectiveCamera,
  RoundedBox,
} from "@react-three/drei";
import { RotateCcw } from "lucide-react";
import * as THREE from "three";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { formatCurrency, getIngredient, type Ingredient } from "~/lib/menu";
import { selectableIngredients, useOrderStore } from "~/lib/order-store";

type VectorTuple = [number, number, number];

const shelfPositions: VectorTuple[] = [
  [-4.2, 1.1, -2.2],
  [-3.1, 1.2, -3.1],
  [-1.7, 1.25, -3.5],
  [-0.25, 1.1, -3.7],
  [1.25, 1.25, -3.55],
  [2.65, 1.1, -3.15],
  [4, 1.2, -2.35],
  [-4.45, 1.05, -0.65],
  [4.45, 1.05, -0.65],
  [-4.1, 1.2, 0.95],
  [4.1, 1.2, 0.95],
  [-3.05, 1.1, 2.45],
  [-1.55, 1.2, 3.05],
  [0, 1.1, 3.2],
  [1.55, 1.2, 3.05],
  [3.05, 1.1, 2.45],
  [-4.65, 1.3, 1.95],
  [4.65, 1.3, 1.95],
  [-4.75, 1.32, -1.65],
  [4.75, 1.32, -1.65],
  [-3.95, 1.42, 3.45],
  [-2.3, 1.48, 4.05],
  [-0.75, 1.42, 4.28],
  [0.75, 1.42, 4.28],
  [2.3, 1.48, 4.05],
  [3.95, 1.42, 3.45],
];

const categoryLabels = {
  base: "Base",
  sauce: "Salsa",
  crunch: "Crujiente",
  protein: "Proteina",
  fresh: "Fresco",
  candy: "Dulce",
  drink: "Bebida",
};

function ingredientTarget(index: number): VectorTuple {
  const ring = Math.floor(index / 10);
  const angle = index * 1.618;
  const radius = 0.2 + (index % 10) * 0.055 + ring * 0.08;

  return [
    Math.cos(angle) * radius,
    0.45 + index * 0.018,
    Math.sin(angle) * radius,
  ];
}

function IngredientGeometry({ ingredient }: { ingredient: Ingredient }) {
  switch (ingredient.shape) {
    case "cube":
      return <boxGeometry args={[0.42, 0.22, 0.34]} />;
    case "slice":
      return <cylinderGeometry args={[0.28, 0.28, 0.08, 32]} />;
    case "stick":
      return <capsuleGeometry args={[0.08, 0.55, 8, 16]} />;
    case "ring":
      return <torusGeometry args={[0.23, 0.06, 12, 32]} />;
    case "bottle":
      return <capsuleGeometry args={[0.12, 0.55, 10, 18]} />;
    case "shrimp":
      return <torusGeometry args={[0.24, 0.08, 16, 40, Math.PI * 1.35]} />;
    default:
      return <sphereGeometry args={[0.24, 24, 24]} />;
  }
}

function PotatoPiece({
  position,
  rotation,
  scale,
}: {
  position: VectorTuple;
  rotation: VectorTuple;
  scale: VectorTuple;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[0.24, 18, 12]} />
        <meshStandardMaterial color="#d8892f" roughness={0.82} />
      </mesh>
      <mesh position={[0.04, 0.05, 0.16]} scale={[0.35, 0.18, 0.22]}>
        <sphereGeometry args={[0.12, 10, 8]} />
        <meshStandardMaterial color="#f0bc59" roughness={0.7} />
      </mesh>
      {Array.from({ length: 4 }, (_, index) => (
        <mesh
          key={index}
          position={[
            Math.sin(index * 2.1) * 0.16,
            Math.cos(index * 1.6) * 0.08,
            Math.sin(index * 0.9) * 0.16,
          ]}
          scale={[0.07, 0.025, 0.045]}
        >
          <sphereGeometry args={[1, 8, 6]} />
          <meshStandardMaterial color="#81501f" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

function TortillaChip({
  position,
  rotation,
  scale = 1,
}: {
  position: VectorTuple;
  rotation: VectorTuple;
  scale?: number;
}) {
  return (
    <mesh
      castShadow
      receiveShadow
      position={position}
      rotation={rotation}
      scale={scale}
    >
      <cylinderGeometry args={[0.22, 0.26, 0.035, 3]} />
      <meshStandardMaterial color="#e0a43a" roughness={0.78} />
    </mesh>
  );
}

function CarneStrip({
  position,
  rotation,
  scale = 1,
}: {
  position: VectorTuple;
  rotation: VectorTuple;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <RoundedBox
        args={[0.72, 0.12, 0.18]}
        radius={0.055}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#5b2b1f" roughness={0.68} />
      </RoundedBox>
      <mesh position={[0.1, 0.07, 0.04]} scale={[0.42, 0.035, 0.08]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#9a5433" roughness={0.62} />
      </mesh>
    </group>
  );
}

function ShrimpPiece({
  position,
  rotation,
  scale = 1,
}: {
  position: VectorTuple;
  rotation: VectorTuple;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.18, 0.055, 12, 28, Math.PI * 1.35]} />
        <meshStandardMaterial color="#f08a62" roughness={0.5} />
      </mesh>
      <mesh position={[0.13, 0.02, 0.02]} scale={[0.35, 0.2, 0.25]}>
        <sphereGeometry args={[0.16, 14, 10]} />
        <meshStandardMaterial color="#ffd0a8" roughness={0.45} />
      </mesh>
    </group>
  );
}

function LimeWedge({
  position,
  rotation,
  scale = 1,
}: {
  position: VectorTuple;
  rotation: VectorTuple;
  scale?: number;
}) {
  return (
    <group position={position} rotation={rotation} scale={scale}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.08, 24, 1, false, 0, Math.PI]} />
        <meshStandardMaterial color="#b9d43f" roughness={0.5} />
      </mesh>
      <mesh
        position={[0, 0.045, 0]}
        rotation={[Math.PI / 2, 0, 0]}
        scale={[0.75, 0.35, 1]}
      >
        <circleGeometry args={[0.18, 24, 0, Math.PI]} />
        <meshStandardMaterial color="#f4ff98" roughness={0.55} />
      </mesh>
    </group>
  );
}

function PicoBits({
  position = [0, 0, 0] as VectorTuple,
}: {
  position?: VectorTuple;
}) {
  return (
    <group position={position}>
      {Array.from({ length: 18 }, (_, index) => (
        <mesh
          key={index}
          castShadow
          position={[
            Math.cos(index * 1.7) * (0.15 + (index % 4) * 0.045),
            0.03 + (index % 3) * 0.035,
            Math.sin(index * 1.7) * (0.12 + (index % 5) * 0.035),
          ]}
          rotation={[index * 0.3, index * 0.5, index * 0.2]}
          scale={[0.07, 0.045, 0.055]}
        >
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              index % 3 === 0
                ? "#d93828"
                : index % 3 === 1
                  ? "#f3efe3"
                  : "#4d9f4a"
            }
            roughness={0.75}
          />
        </mesh>
      ))}
    </group>
  );
}

function CheeseStrands() {
  return (
    <group>
      {Array.from({ length: 14 }, (_, index) => (
        <mesh
          key={index}
          castShadow
          position={[
            Math.cos(index * 0.9) * 0.7,
            0.7 + (index % 3) * 0.04,
            Math.sin(index * 0.9) * 0.48,
          ]}
          rotation={[0.2, index * 0.5, 0.35]}
          scale={[0.42 + (index % 3) * 0.08, 0.035, 0.055]}
        >
          <capsuleGeometry args={[0.08, 0.42, 6, 12]} />
          <meshStandardMaterial
            color="#ffd23f"
            roughness={0.24}
            metalness={0.03}
          />
        </mesh>
      ))}
    </group>
  );
}

function IngredientModel({
  ingredient,
  scale = 1,
  emissive = false,
}: {
  ingredient: Ingredient;
  scale?: number;
  emissive?: boolean;
}) {
  const isBottle = ingredient.shape === "bottle";
  const isPotato = ingredient.id === "papas";
  const isSauce = ingredient.category === "sauce";

  if (ingredient.id === "carne-seca") {
    return (
      <group scale={scale}>
        <CarneStrip position={[0, 0, 0]} rotation={[0.2, 0.2, -0.2]} />
        <CarneStrip
          position={[0.04, 0.14, 0.12]}
          rotation={[-0.15, -0.7, 0.35]}
          scale={0.8}
        />
      </group>
    );
  }

  if (ingredient.id === "camaron") {
    return (
      <ShrimpPiece
        position={[0, 0, 0]}
        rotation={[0.4, 0.2, -0.3]}
        scale={scale}
      />
    );
  }

  if (ingredient.id === "limon") {
    return (
      <LimeWedge
        position={[0, 0, 0]}
        rotation={[0.2, -0.5, 0.1]}
        scale={scale * 1.2}
      />
    );
  }

  if (ingredient.id === "pico-gallo") {
    return <PicoBits />;
  }

  return (
    <group scale={scale}>
      <mesh
        castShadow
        receiveShadow
        rotation={[ingredient.shape === "slice" ? Math.PI / 2 : 0, 0, 0]}
      >
        <IngredientGeometry ingredient={ingredient} />
        <meshStandardMaterial
          color={ingredient.color}
          emissive={emissive ? ingredient.accent : "#000000"}
          emissiveIntensity={emissive ? 0.14 : 0}
          metalness={isSauce ? 0.03 : 0.08}
          roughness={isSauce ? 0.28 : 0.56}
        />
      </mesh>
      <mesh position={[0.08, 0.08, 0.08]} scale={0.55}>
        <IngredientGeometry ingredient={ingredient} />
        <meshStandardMaterial
          color={ingredient.accent}
          roughness={isSauce ? 0.22 : 0.72}
        />
      </mesh>
      {isPotato
        ? Array.from({ length: 5 }, (_, index) => (
            <mesh
              key={index}
              position={[
                Math.sin(index * 1.9) * 0.16,
                Math.cos(index * 2.2) * 0.08,
                Math.sin(index * 0.8) * 0.18,
              ]}
              scale={0.18}
            >
              <sphereGeometry args={[0.06, 8, 8]} />
              <meshStandardMaterial color="#9a5b22" roughness={0.9} />
            </mesh>
          ))
        : null}
      {isBottle ? (
        <>
          <mesh position={[0, 0.42, 0]}>
            <cylinderGeometry args={[0.1, 0.1, 0.12, 20]} />
            <meshStandardMaterial color="#1f1712" roughness={0.4} />
          </mesh>
          <mesh position={[0, 0.05, 0.13]} scale={[0.85, 0.55, 0.12]}>
            <boxGeometry args={[0.24, 0.22, 0.05]} />
            <meshStandardMaterial color={ingredient.accent} roughness={0.35} />
          </mesh>
        </>
      ) : null}
    </group>
  );
}

function Tray() {
  return (
    <group rotation={[0, 0, 0]}>
      <RoundedBox
        args={[3.65, 0.32, 2.32]}
        radius={0.22}
        smoothness={8}
        position={[0, 0.16, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#11100f"
          metalness={0.35}
          roughness={0.32}
        />
      </RoundedBox>
      <RoundedBox
        args={[3.95, 0.16, 2.58]}
        radius={0.26}
        smoothness={8}
        position={[0, 0.34, 0]}
        receiveShadow
        castShadow
      >
        <meshStandardMaterial
          color="#272321"
          metalness={0.5}
          roughness={0.26}
        />
      </RoundedBox>
      <RoundedBox
        args={[3.42, 0.09, 2.08]}
        radius={0.2}
        smoothness={8}
        position={[0, 0.44, 0]}
        receiveShadow
      >
        <meshStandardMaterial
          color="#0c0b0a"
          metalness={0.25}
          roughness={0.35}
        />
      </RoundedBox>
      <mesh position={[0.25, 0.45, 0.15]} rotation={[Math.PI / 2, 0, -0.3]}>
        <ringGeometry args={[0.35, 1.3, 72]} />
        <meshStandardMaterial
          transparent
          color="#ffffff"
          opacity={0.055}
          roughness={0.1}
        />
      </mesh>
      <Html center distanceFactor={7} position={[0, 0.9, 0]} transform>
        <div className="rounded-full border border-amber-200/40 bg-black/65 px-3 py-1 text-[10px] font-semibold tracking-[0.18em] text-amber-100 uppercase shadow-lg backdrop-blur">
          Charola
        </div>
      </Html>
    </group>
  );
}

function PotatoBase() {
  const basePieces = Array.from({ length: 26 }, (_, index) => {
    const target = ingredientTarget(index);

    return {
      key: `base-${index}`,
      position: [
        target[0] * 2.5,
        0.56 + (index % 6) * 0.035,
        target[2] * 2.2,
      ] as VectorTuple,
      rotation: [index * 0.33, index * 0.21, index * 0.29] as VectorTuple,
      scale: [
        1 + (index % 4) * 0.08,
        0.58 + (index % 3) * 0.08,
        0.82 + (index % 5) * 0.055,
      ] as VectorTuple,
    };
  });

  return (
    <group>
      {basePieces.map((piece) => (
        <PotatoPiece
          key={piece.key}
          position={piece.position}
          rotation={piece.rotation}
          scale={piece.scale}
        />
      ))}
      {Array.from({ length: 14 }, (_, index) => (
        <TortillaChip
          key={`chip-${index}`}
          position={[
            Math.cos(index * 1.1) * 1.25,
            0.54 + (index % 4) * 0.045,
            Math.sin(index * 1.1) * 0.78,
          ]}
          rotation={[0.15, index * 0.42, 0.25]}
          scale={0.72 + (index % 4) * 0.06}
        />
      ))}
    </group>
  );
}

function SaucePools() {
  return (
    <group>
      {[
        {
          color: "#f7c52d",
          position: [-0.35, 0.64, 0.2] as VectorTuple,
          scale: [0.7, 0.08, 0.38] as VectorTuple,
        },
        {
          color: "#d83b1f",
          position: [0.42, 0.69, -0.1] as VectorTuple,
          scale: [0.52, 0.07, 0.3] as VectorTuple,
        },
        {
          color: "#fff2cf",
          position: [0.05, 0.72, 0.45] as VectorTuple,
          scale: [0.42, 0.06, 0.22] as VectorTuple,
        },
      ].map((pool, index) => (
        <mesh
          key={index}
          position={pool.position}
          rotation={[Math.PI / 2, 0, index * 0.6]}
          scale={pool.scale}
        >
          <sphereGeometry args={[1, 32, 16]} />
          <meshStandardMaterial
            color={pool.color}
            metalness={0.02}
            roughness={0.12}
          />
        </mesh>
      ))}
      <CheeseStrands />
      <CarneStrip
        position={[-0.78, 0.93, 0.02]}
        rotation={[0.15, -0.55, -0.1]}
        scale={0.95}
      />
      <CarneStrip
        position={[-0.72, 1.03, 0.28]}
        rotation={[0.2, -0.2, 0.35]}
        scale={0.75}
      />
      <ShrimpPiece
        position={[0.76, 0.98, -0.12]}
        rotation={[0.35, 0.8, 0.1]}
        scale={0.95}
      />
      <ShrimpPiece
        position={[0.92, 0.88, 0.18]}
        rotation={[0.1, 1.4, -0.18]}
        scale={0.8}
      />
      <PicoBits position={[0.18, 0.96, -0.42]} />
      <LimeWedge
        position={[1.18, 0.78, 0.62]}
        rotation={[0.3, -0.9, 0.1]}
        scale={0.85}
      />
    </group>
  );
}

function DroppedIngredientMesh({
  ingredient,
  index,
}: {
  ingredient: Ingredient;
  index: number;
}) {
  const groupRef = useRef<THREE.Group>(null);
  const startTimeRef = useRef<number | null>(null);
  const target = useMemo(() => ingredientTarget(index), [index]);
  const start = useMemo<VectorTuple>(
    () => [target[0] * 3.8, 3.8 + (index % 4) * 0.35, target[2] * 3.8],
    [index, target],
  );

  useFrame((state) => {
    if (!groupRef.current) return;

    startTimeRef.current ??= state.clock.elapsedTime;
    const elapsed = state.clock.elapsedTime;
    const progress = Math.min(
      1,
      Math.max(0, (elapsed - startTimeRef.current - index * 0.018) / 0.82),
    );
    const eased = 1 - Math.pow(1 - progress, 3);

    groupRef.current.position.set(
      THREE.MathUtils.lerp(start[0], target[0], eased),
      THREE.MathUtils.lerp(start[1], target[1], eased) +
        Math.sin(progress * Math.PI) * 0.18,
      THREE.MathUtils.lerp(start[2], target[2], eased),
    );
    groupRef.current.rotation.set(
      elapsed * 0.45 + index,
      elapsed * 0.28 + index * 0.4,
      elapsed * 0.34,
    );
  });

  return (
    <group ref={groupRef}>
      <IngredientModel emissive ingredient={ingredient} scale={0.82} />
    </group>
  );
}

function IngredientToken({
  ingredient,
  position,
}: {
  ingredient: Ingredient;
  position: VectorTuple;
}) {
  const addIngredient = useOrderStore((state) => state.addIngredient);
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState<VectorTuple>(position);

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsDragging(true);
  };

  const handlePointerMove = (event: ThreeEvent<PointerEvent>) => {
    if (!isDragging) return;

    event.stopPropagation();
    setDragPosition([event.point.x, 1.55, event.point.z]);
  };

  const handlePointerUp = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    setIsDragging(false);
    setDragPosition(position);
    addIngredient(ingredient.id);
  };

  return (
    <group
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      position={isDragging ? dragPosition : position}
      scale={isDragging ? 1.18 : 1}
    >
      <Float floatIntensity={0.18} rotationIntensity={0.18} speed={2}>
        <IngredientModel emissive={isDragging} ingredient={ingredient} />
      </Float>
      <Html center distanceFactor={6} position={[0, -0.58, 0]} transform>
        <div className="pointer-events-none min-w-20 rounded-full border border-white/15 bg-black/75 px-2 py-1 text-center text-[10px] font-medium text-white shadow-lg backdrop-blur">
          {ingredient.shortName}
        </div>
      </Html>
    </group>
  );
}

function BuilderScene() {
  const droppedIngredients = useOrderStore((state) => state.droppedIngredients);
  const visibleIngredients = selectableIngredients.slice(
    0,
    shelfPositions.length,
  );

  return (
    <>
      <color attach="background" args={["#20130d"]} />
      <fog attach="fog" args={["#20130d", 7, 12]} />
      <PerspectiveCamera makeDefault fov={38} position={[0, 4.2, 5.25]} />
      <ambientLight intensity={0.55} />
      <hemisphereLight args={["#fff1d2", "#2b140d", 1.3]} />
      <directionalLight castShadow intensity={2.1} position={[3.5, 6, 4]} />
      <spotLight
        angle={0.46}
        intensity={2.4}
        penumbra={0.55}
        position={[-3.5, 5.2, 2.6]}
      />
      <group position={[0, -0.45, 0]}>
        <Tray />
        <PotatoBase />
        <SaucePools />
        {droppedIngredients
          .filter((item) => item.id !== "papas")
          .map((item, index) => (
            <DroppedIngredientMesh
              key={item.instanceId}
              index={index}
              ingredient={getIngredient(item.id)}
            />
          ))}
      </group>
      {visibleIngredients.map((ingredient, index) => (
        <IngredientToken
          key={ingredient.id}
          ingredient={ingredient}
          position={shelfPositions[index]!}
        />
      ))}
      <mesh
        receiveShadow
        position={[0, -0.68, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <planeGeometry args={[12, 10]} />
        <meshStandardMaterial color="#20130d" roughness={0.86} />
      </mesh>
      <ContactShadows
        blur={2.4}
        color="#000000"
        far={8}
        opacity={0.45}
        resolution={512}
      />
      <OrbitControls
        enablePan={false}
        enableZoom
        maxPolarAngle={Math.PI / 2.15}
        minDistance={4.5}
        minPolarAngle={Math.PI / 5}
        maxDistance={8}
        target={[0, 0.35, 0]}
      />
    </>
  );
}

export function PotatoBuilder3D() {
  const clearIngredients = useOrderStore((state) => state.clearIngredients);
  const droppedIngredients = useOrderStore((state) => state.droppedIngredients);
  const uniqueCount = new Set(droppedIngredients.map((item) => item.id)).size;

  return (
    <section className="border-border relative h-[620px] overflow-hidden border-y bg-[#211611] sm:h-[720px] lg:h-[780px]">
      <div className="absolute top-3 left-3 z-10 flex max-w-[calc(100%-1.5rem)] flex-wrap items-center gap-2">
        <Badge className="bg-amber-300 text-stone-950 hover:bg-amber-300">
          {droppedIngredients.length} ingredientes
        </Badge>
        <Badge
          className="border-white/20 bg-black/35 text-white"
          variant="outline"
        >
          {uniqueCount} unicos
        </Badge>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              aria-label="Vaciar charola"
              className="bg-black/50 text-white hover:bg-black/70"
              onClick={clearIngredients}
              size="icon-sm"
              variant="secondary"
            >
              <RotateCcw className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Vaciar charola</TooltipContent>
        </Tooltip>
      </div>

      <div className="absolute right-3 bottom-3 left-3 z-10 rounded-lg border border-white/10 bg-black/55 p-3 text-xs text-white shadow-2xl backdrop-blur md:left-auto md:max-w-sm">
        <p className="font-semibold text-amber-100">
          Toca o arrastra ingredientes.
        </p>
        <p className="mt-1 text-white/70">
          Al soltar, el ingrediente cae a la charola. La camara gira suave para
          dar profundidad.
        </p>
      </div>

      <div className="absolute inset-0">
        <Canvas
          dpr={[1, 1.7]}
          gl={{ antialias: true, alpha: false }}
          onCreated={({ gl }) => {
            gl.setClearColor("#20130d", 1);
          }}
          shadows
          style={{ background: "#20130d", height: "100%", width: "100%" }}
        >
          <BuilderScene />
        </Canvas>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/55 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/55 to-transparent" />

      <div className="absolute top-3 right-3 z-10 hidden rounded-lg border border-white/10 bg-black/45 p-3 text-xs text-white backdrop-blur lg:block">
        <div className="mb-2 font-semibold text-amber-100">Categorias</div>
        <div className="grid grid-cols-2 gap-1.5">
          {Object.entries(categoryLabels)
            .filter(([key]) => key !== "drink")
            .map(([key, label]) => {
              const count = selectableIngredients.filter(
                (item) => item.category === key,
              ).length;

              return (
                <span
                  key={key}
                  className="rounded-md bg-white/10 px-2 py-1 text-white/80"
                >
                  {label}: {count}
                </span>
              );
            })}
        </div>
        <div className="mt-2 text-white/55">
          Extras desde {formatCurrency(5)} hasta {formatCurrency(50)}
        </div>
      </div>
    </section>
  );
}
