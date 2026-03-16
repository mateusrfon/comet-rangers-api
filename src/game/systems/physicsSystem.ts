// gather all physics system as one Physics.resolveCollision(), pure math here

export class Physics {
  constructor() {}

  resolveCollision() {
    // Implement collision resolution logic here
    // This could involve moving objects, checking for overlaps, etc.
    // Example:
    // for (let i = 0; i < this.objects.length; i++) {
    //     for (let j = i + 1; j < this.objects.length; j++) {
    //         if (this.objects[i].collidesWith(this.objects[j])) {
    //             this.objects[i].resolveCollision(this.objects[j]);
    //             this.objects[j].resolveCollision(this.objects[i]);
    //         }
    //     }
    //
  }
}

// input to player velocity + shoot check
// physics update positions (maybe boundaries and collision in here)
// boundaries
// handle collisions
// clean entities
