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
  refresh: (params?: Record<string, unknown>) => void;
  readonly currentScene: string;
  readonly state: {routes: Array<Record<string, unknown>>};
  [scene: string]: unknown;
};

export const Actions: ActionsType = new Proxy(
  {
    push,
    pop,
    popTo,
    reset: (name: string) => navReset(name),
    refresh: (params?: Record<string, unknown>) => navRefresh(params ?? new Date() as unknown as Record<string, unknown>),
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
      return (params?: Record<string, unknown>) => push(prop as string, params);
    },
  },
);
