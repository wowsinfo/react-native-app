import {
  push,
  pop,
  popTo,
  reset as navReset,
  refresh as navRefresh,
  getCurrentScene,
  getRoutes,
} from './NavigationService';

export type ActionsType = {
  push: typeof push;
  pop: typeof pop;
  popTo: typeof popTo;
  reset: (name: string) => void;
  refresh: (params?: any) => void;
  readonly currentScene: string;
  readonly state: {routes: any[]};
  [scene: string]: any;
};

export const Actions: ActionsType = new Proxy(
  {
    push,
    pop,
    popTo,
    reset: (name: string) => navReset(name),
    refresh: (params?: any) => navRefresh(params ?? new Date()),
    get currentScene() {
      return getCurrentScene();
    },
    get state() {
      return {routes: getRoutes()};
    },
  },
  {
    get(_target, prop: string | symbol) {
      if (prop in _target || typeof prop === 'symbol') {
        return _target[prop as keyof typeof _target];
      }
      return (params?: any) => push(prop as string, params);
    },
  },
);
