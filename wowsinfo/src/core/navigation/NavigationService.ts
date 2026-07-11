import {
  createNavigationContainerRef,
  StackActions,
} from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

export function push(name: string, params?: any) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
}

export function pop() {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.pop());
  }
}

export function popTo(name: string) {
  if (navigationRef.isReady()) {
    navigationRef.dispatch(StackActions.popTo(name));
  }
}

export function reset(name: string) {
  if (navigationRef.isReady()) {
    navigationRef.reset({
      index: 0,
      routes: [{name}],
    });
  }
}

export function refresh(params?: any) {
  if (navigationRef.isReady()) {
    const route = navigationRef.getCurrentRoute() as {params?: any} | undefined;
    if (route) {
      navigationRef.setParams({...(route as any).params, ...(params ?? {})});
    }
  }
}

export function getCurrentScene(): string {
  if (navigationRef.isReady()) {
    return (navigationRef.getCurrentRoute() as {name?: string} | undefined)?.name ?? '';
  }
  return '';
}

export function getRoutes() {
  if (navigationRef.isReady()) {
    return navigationRef.getState()?.routes ?? [];
  }
  return [];
}
