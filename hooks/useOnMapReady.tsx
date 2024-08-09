// import { useMap } from "$/hooks/useMap";
// import { useEffect, useState } from "react";

// type LoadState = "load" | "style.load";

// type Callbacks = { [key: string]: Function[] };

// /**
//  * Returns onMapReady, a function that's useful for ensuring that a map-dependent callback won't be executed until a given load state has been reached. This is particularly important when the map is conditionally initialized.
//  * @returns {Function} onMapReady - Executes the specified callback when the map reaches the specified load state.
//  */
// export const useOnMapReady = () => {
//   const { map, loaded, styleLoaded } = useMap();
//   console.log("styleLoaded:");
//   const [callbacks, setCallbacks] = useState<Callbacks>({});
//   const [test, setTest] = useState("");

//   useEffect(() => {
//     // setTestHere(() => {}, "load");
//     console.log("TEST: ", test);
//     console.log("callbacks: ", callbacks);
//   }, [callbacks, test]);

//   const setTestHere = (callback: () => void, state: LoadState = "load") => {
//     console.log("SET TEST HERE");
//     setTest("THIS IS TEST");
//   };

//   const onMapReady = (callback: () => void, state: LoadState = "load") => {
//     console.log("ONMAPREADY", state, callback);
//     /**
//      * If the map has already been initialized and the specified map state has been reached, execute the callback:
//      */
//     console.log("map: ", map, "mapStates: ", mapStates, "state: ", state);

//     if (map && mapStates[state]) callback();
//     /**
//      * If the map hasn't been initialized yet, or the map hasn't reached the specified load state, add the callback to the list of callbacks that will be executed when the map is ready:
//      */ else {
//       const newCallbacks = { ...callbacks }; // Clone callbacks
//       if (!newCallbacks[state]) newCallbacks[state] = []; // Make sure that a list is initialized for the state if needed
//       newCallbacks[state].push(callback); // Append the callback to the list
//       console.log(newCallbacks);
//       setCallbacks(newCallbacks);
//       setTest("TESTTEST");
//       console.log("after setCallbacks");
//     }
//   };

//   /**
//    * Maps each state to the function that checks if that state has been reached.
//    */
//   const mapStates = {
//     load: loaded,
//     "style.load": styleLoaded,
//   };

//   /**
//    * Tracks the map's load states, and when a map load state is reached, executes all queued callbacks for that state. For example, if there are queued callbacks that should execute on map "load", and the map is loaded, all of these callbacks will be executed and dequeued.
//    */
//   useEffect(() => {
//     /**
//      * Executes all queued callbacks for the specified load state, and removes them from the queue.
//      * @param {LoadState} state - The load state that triggers execution of associated queued callbacks.
//      */
//     const executeAllCallbacks = (state: LoadState) => {
//       if (!callbacks[state]) return; // Make sure that there are callbacks to iterate over
//       for (const callback of callbacks[state]) {
//         callback();
//       }
//       setCallbacks({ ...callbacks, [state]: [] });
//     };

//     if (loaded) executeAllCallbacks("load");
//     if (styleLoaded) executeAllCallbacks("style.load");
//   }, [loaded, styleLoaded]);

//   return { onMapReady, setTestHere };
// };
