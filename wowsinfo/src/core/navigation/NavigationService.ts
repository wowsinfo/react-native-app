import {
  createNavigationContainerRef,
  StackActions,
  CommonActions,
  NavigationState,
  Route,
} from '@react-navigation/native';

export type RootStackParamList = Record<string, any>;

export const navigationRef = createNavigationContainerRef<RootStackParamList>();

export const NavigationService = {
  push(name: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(StackActions.push(name, params));
    }
  },

  pop() {
    if (navigationRef.isReady() && navigationRef.canGoBack()) {
      navigationRef.goBack();
    }
  },

  popTo(name: string) {
    if (navigationRef.isReady()) {
      const state = navigationRef.getState();
      const routeIndex = state.routes.findIndex(r => r.name === name);
      if (routeIndex !== -1) {
        navigationRef.dispatch(StackActions.pop(state.routes.length - routeIndex - 1));
      }
    }
  },

  reset(name: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{name, params}],
        }),
      );
    }
  },

  refresh(params?: any) {
    if (navigationRef.isReady()) {
      const route = navigationRef.getCurrentRoute();
      if (route) {
        navigationRef.dispatch({
          ...CommonActions.setParams(params || {}),
          source: route.key,
        });
      }
    }
  },

  navigate(name: string, params?: any) {
    if (navigationRef.isReady()) {
      navigationRef.navigate(name, params);
    }
  },

  getState(): NavigationState | null {
    return navigationRef.isReady() ? navigationRef.getState() : null;
  },

  getCurrentRoute(): Route<string> | undefined {
    return navigationRef.isReady() ? navigationRef.getCurrentRoute() : undefined;
  },

  currentScene(): string {
    const route = this.getCurrentRoute();
    return route?.name || '';
  },
};

// Backward compatibility with Actions API
export const Actions = {
  push: NavigationService.push,
  pop: NavigationService.pop,
  popTo: NavigationService.popTo,
  reset: NavigationService.reset,
  refresh: NavigationService.refresh,
  
  // Named routes for direct navigation
  Menu: () => NavigationService.navigate('Menu'),
  ProVersion: () => NavigationService.navigate('ProVersion'),
  
  get state() {
    const state = NavigationService.getState();
    return {
      routes: state?.routes || [],
    };
  },

  get currentScene() {
    return NavigationService.currentScene();
  },
};
