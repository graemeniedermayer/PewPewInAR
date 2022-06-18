import {THREE} from './three-defs.js';

import {entity} from './entity.js';

import {player_controller} from './player-controller.js';
import {player_input} from './player-input.js';
import {render_component} from './render-component.js';
import {xwing_controller} from './xwing-controller.js';
import {xwing_effect} from './xwing-effects.js';
import {tie_fighter_controller} from './tie-fighter-controller.js';
import {basic_rigid_body} from './basic-rigid-body.js';
import {mesh_rigid_body} from './mesh-rigid-body.js';
import {explode_component} from './explode-component.js';
import {health_controller} from './health-controller.js';
import {ship_effect} from './ship-effects.js';
import {spatial_grid_controller} from './spatial-grid-controller.js';
import {enemy_ai_controller} from './enemy-ai-controller.js';

export const spawners = (() => {

  class PlayerSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn() {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        offset: new THREE.Vector3(0, -.05, -.04),
        blasterStrength: 10,
      };

      const player = new entity.Entity();
      player.Attributes.team = 'allies';
      player.SetPosition(new THREE.Vector3(0, 0, -0.1));
      player.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
      player.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: './resources/models/x-wing/',
        resourceName: 'scene.gltf',
        scale: 0.02,
        offset: {
          position: new THREE.Vector3(0, -.05, -.04),
          quaternion: new THREE.Quaternion(),
        },
      }));
      player.AddComponent(new xwing_controller.XWingController(params));
      player.AddComponent(new xwing_effect.XWingEffects(params));
      player.AddComponent(new player_input.PlayerInput());
      player.AddComponent(new player_controller.PlayerController());
      player.AddComponent(new basic_rigid_body.BasicRigidBody({
        box: new THREE.Vector3(0.18, 0.06, .08),
      }));
      player.AddComponent(new health_controller.HealthController({
        maxHealth: 50,
        shields: 50,
      }));

      this.Manager.Add(player, 'player');

      return player;
    }
  };

  class TieFighterSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn() {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        blasterStrength: 20,
      };

      const e = new entity.Entity();
      e.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
      e.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: './resources/models/tie-fighter-gltf/',
        resourceName: 'scene.gltf',
        scale: 0.0015,
        colour: new THREE.Color(0xFFFFFF),
      }));
      e.AddComponent(new tie_fighter_controller.TieFighterController(params));
      e.AddComponent(new basic_rigid_body.BasicRigidBody({
        box: new THREE.Vector3(.15, .15, .15)
      }));
      e.AddComponent(new health_controller.HealthController({
        maxHealth: 50,
      }));
      // DEMO
      e.AddComponent(new enemy_ai_controller.EnemyAIController({
        grid: this.params_.grid,
      }));

      this.Manager.Add(e);

      return e;
    }
  };


  class XWingSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn() {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        blasterStrength: 10,
        offset: new THREE.Vector3(0, -.05, -.04),
      };

      const e = new entity.Entity();
      e.AddComponent(
        new spatial_grid_controller.SpatialGridController(
            {grid: this.params_.grid}));
      e.AddComponent(new render_component.RenderComponent({
        scene: params.scene,
        resourcePath: './resources/models/x-wing/',
        resourceName: 'scene.gltf',
        scale: .02,
        offset: {
          position: new THREE.Vector3(0, -.05, -.04),
          quaternion: new THREE.Quaternion(),
        },
      }));
      e.AddComponent(new xwing_effect.XWingEffects(params));
      e.AddComponent(new xwing_controller.XWingController(params));
      e.AddComponent(new basic_rigid_body.BasicRigidBody({
        box: new THREE.Vector3(.15, .15, .15)
      }));
      e.AddComponent(new health_controller.HealthController({
        maxHealth: 50,
        shields: 50,
      }));
      // e.AddComponent(new floating_descriptor.FloatingDescriptor());
      e.AddComponent(new enemy_ai_controller.EnemyAIController({
        grid: this.params_.grid,
      }));

      this.Manager.Add(e);

      return e;
    }
  };


  class ShipSmokeSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(target) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
        target: target,
      };

      const e = new entity.Entity();
      e.SetPosition(target.Position);
      e.AddComponent(new ship_effect.ShipEffects(params));

      this.Manager.Add(e);

      return e;
    }
  };

  class ExplosionSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(pos) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
      };

      const e = new entity.Entity();
      e.SetPosition(pos);
      e.AddComponent(new explode_component.ExplodeEffect(params));

      this.Manager.Add(e);

      return e;
    }
  };

  class TinyExplosionSpawner extends entity.Component {
    constructor(params) {
      super();
      this.params_ = params;
    }

    Spawn(pos) {
      const params = {
        camera: this.params_.camera,
        scene: this.params_.scene,
      };

      const e = new entity.Entity();
      e.SetPosition(pos);
      e.AddComponent(new explode_component.TinyExplodeEffect(params));

      this.Manager.Add(e);

      return e;
    }
  };

  return {
    PlayerSpawner: PlayerSpawner,
    TieFighterSpawner: TieFighterSpawner,
    XWingSpawner: XWingSpawner,
    ExplosionSpawner: ExplosionSpawner,
    TinyExplosionSpawner: TinyExplosionSpawner,
    ShipSmokeSpawner: ShipSmokeSpawner,
  };
})();