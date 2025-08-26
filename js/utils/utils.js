   export function randomIntRange(min,max){
        return (Math.floor(Math.random() * (max - min + 1)) + min);
    }
    export function randomRange(min,max){
         return ((Math.random() * (max - min + 1)) + min);
    }
    
    export function mapMouseValue(value, min, max) {
     //mapping from -1 to 1
          // Clamp input to [-1, 1]
          value = Math.max(-1, Math.min(1, value));

          // Normalize from [-1, 1] to [0, 1]
          const normalized = (value + 1) / 2;

          // Map to [min, max]
          return min + normalized * (max - min);
     }

   
    export function clamp(value, min, max) {
     return Math.max(min, Math.min(value, max));
     }

