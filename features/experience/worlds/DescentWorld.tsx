"use client";

import {
  StairFlight,
  GlassRailing,
  MonitorWall,
  LightShaft,
  Silhouette,
} from "../props/Facility";

/**
 * Scene 03 — the descent. A monumental stairwell void: the camera drops
 * through the open center while illuminated flights descend alongside,
 * past layered walkways and technical displays, toward the blue glow.
 */
export function DescentWorld() {
  return (
    <group>
      {/* landing deck continuing from the ops floor */}
      <mesh position={[0, -0.25, -120]} receiveShadow>
        <boxGeometry args={[30, 0.5, 8]} />
        <meshStandardMaterial color="#232f45" roughness={0.6} metalness={0.4} />
      </mesh>
      {/* edge light at the void */}
      <mesh position={[0, 0.03, -123.6]}>
        <boxGeometry args={[8, 0.04, 0.1]} />
        <meshBasicMaterial color="#7dd3fc" toneMapped={false} />
      </mesh>

      {/* shaft walls — from y -14 up to y 7 */}
      {[-14.5, 14.5].map((x) => (
        <mesh key={x} position={[x, -3.5, -146]} receiveShadow>
          <boxGeometry args={[0.8, 22, 48]} />
          <meshStandardMaterial color="#17222f" roughness={0.75} metalness={0.35} />
        </mesh>
      ))}
      {/* back wall of the void */}
      <mesh position={[0, -3.5, -169]} receiveShadow>
        <boxGeometry args={[30, 22, 0.8]} />
        <meshStandardMaterial color="#16202f" roughness={0.75} metalness={0.35} />
      </mesh>

      {/* the flights — parallel stairs descending along the void */}
      <StairFlight position={[-5.8, 0, -122.5]} width={4.4} depth={30} drop={8} />
      <StairFlight position={[5.8, 0, -122.5]} width={4.4} depth={30} drop={8} />
      {/* lower return flights to the chamber floor */}
      <StairFlight position={[-9.5, -8, -152.5]} width={3.6} depth={10} drop={6} />
      <StairFlight position={[9.5, -8, -152.5]} width={3.6} depth={10} drop={6} />

      {/* glass balustrades along the void + flights */}
      <GlassRailing position={[-3.6, 0, -127]} length={9} rotationY={Math.PI / 2} />
      <GlassRailing position={[3.6, 0, -127]} length={9} rotationY={Math.PI / 2} />
      <GlassRailing position={[-3.4, -2.6, -140]} length={22} rotationY={Math.PI / 2} />
      <GlassRailing position={[3.4, -2.6, -140]} length={22} rotationY={Math.PI / 2} />

      {/* wall ledges — layered walkways at descending levels */}
      {[-4, -9].map((y, li) => (
        <group key={y}>
          {[-11.5, 11.5].map((x) => (
            <group key={x}>
              <mesh position={[x, y, -142 - li * 6]} receiveShadow castShadow>
                <boxGeometry args={[4.5, 0.35, 26]} />
                <meshStandardMaterial color="#22304a" roughness={0.6} metalness={0.5} />
              </mesh>
              <GlassRailing
                position={[x > 0 ? x - 2.1 : x + 2.1, y + 0.18, -142 - li * 6]}
                length={24}
                rotationY={Math.PI / 2}
              />
            </group>
          ))}
        </group>
      ))}

      {/* technical displays on the shaft walls */}
      <MonitorWall position={[-14, 1.8, -132]} rotationY={Math.PI / 2} cols={3} rows={2} />
      <MonitorWall position={[14, -0.5, -140]} rotationY={-Math.PI / 2} cols={3} rows={2} accent="#34d399" />
      <MonitorWall position={[-14, -4.5, -150]} rotationY={Math.PI / 2} cols={3} rows={2} accent="#a78bfa" />
      <MonitorWall position={[14, -7.5, -156]} rotationY={-Math.PI / 2} cols={3} rows={2} />

      {/* silhouettes on the walkways — scale cue */}
      <Silhouette position={[-11.5, -3.8, -136]} rotationY={Math.PI / 2} />
      <Silhouette position={[11.5, -8.8, -150]} rotationY={-Math.PI / 2} />
      <Silhouette position={[-11.4, -8.8, -155]} rotationY={1.2} />

      {/* blue light shafts rising from the depths */}
      <LightShaft position={[0, -6, -152]} radius={4.5} height={16} opacity={0.08} />
      <LightShaft position={[-6, -7, -158]} radius={2.5} height={14} color="#5aa0e8" opacity={0.07} />
      <LightShaft position={[6, -7, -158]} radius={2.5} height={14} color="#5aa0e8" opacity={0.07} />

      {/* lighting — cold descending blue */}
      <directionalLight
        position={[0, 10, -125]}
        intensity={0.7}
        color="#bcd8ff"
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-18}
        shadow-camera-right={18}
        shadow-camera-top={18}
        shadow-camera-bottom={-18}
        shadow-camera-near={2}
        shadow-camera-far={60}
        shadow-bias={-0.0004}
      />
      <pointLight color="#4a90e0" intensity={24} distance={40} position={[0, -12, -155]} />
      <pointLight color="#2a5a9e" intensity={10} distance={24} position={[0, -4, -135]} />
      <hemisphereLight args={["#24354e", "#060b16", 0.4]} />
    </group>
  );
}
