import * as _ from 'lodash';
import * as React from 'react';
import { Store, AnyAction } from 'redux';

export abstract class Service {
  context: DashboardContext;

  abstract initService(): void;
}

export abstract class Actions {
  context: DashboardContext;

  init(): void {
    // do nothing
  }
}

export class DashboardContext {
  private servicesMap: Map<typeof Service, Service> = new Map<
    typeof Service,
    Service
  >();

  private actionsMap: Map<typeof Actions, Actions> = new Map<
    typeof Actions,
    Actions
  >();

  private actionDispatcherMap: Map<any, any> = new Map<any, any>();

  public dataWorker: Worker;

  public dispatch: any;

  private store: Store<any, AnyAction>;

  private storeChangeListeners: ((
    branchesWithChanges: string[],
    action: any,
    state: any,
    oldState: any
  ) => void)[] = [];

  public injectDependencies(entity: any): any {
    const { serviceMemberVars } = entity;
    const { actionsMemberVars } = entity;
    const { actionDispatcherMemberVars } = entity;
    if (serviceMemberVars) {
      Object.keys(serviceMemberVars).forEach((serviceProp: any) => {
        entity[serviceProp] = this.getServiceInstance(
          serviceMemberVars[serviceProp]
        );
      });
    }
    if (actionsMemberVars) {
      Object.keys(actionsMemberVars).forEach((actionProp: any) => {
        entity[actionProp] = this.getActionsInstance(
          actionsMemberVars[actionProp]
        );
      });
    }
    if (actionDispatcherMemberVars) {
      Object.keys(actionDispatcherMemberVars).forEach((actionProp: any) => {
        entity[actionProp] = this.getActionDispatcher(
          actionDispatcherMemberVars[actionProp]
        );
      });
    }
    return entity;
  }

  getServiceInstance<S = any>(ServiceType: any): S {
    let service: any = this.servicesMap.get(ServiceType);
    if (!service) {
      service = new ServiceType();
      service.context = this;
      this.servicesMap.set(ServiceType, service);
      this.injectDependencies(service);
      service.initService();
    }
    return service;
  }

  getActionsInstance<A = any>(ActionsType: any): A {
    let actions: any = this.actionsMap.get(ActionsType);
    if (!actions) {
      actions = new ActionsType();
      actions.context = this;
      this.actionsMap.set(ActionsType, actions);
      this.injectDependencies(actions);
      if (actions.actionCreatorList) {
        actions.actionCreatorList.forEach((actionName: string): void => {
          const actionCreator = actions[actionName].bind(actions);
          actions[actionName] = (...args: any[]) => {
            const action = actionCreator(...args);
            if (typeof action === 'object') {
              this.dispatch(action);
            } else if (typeof action === 'function') {
              action(this.dispatch);
            }
          };
        });
      }
      actions.init();
    }
    return actions;
  }

  getActionDispatcher<A = any>(ActionsType: any): A {
    let actions: any = this.actionDispatcherMap.get(ActionsType);
    if (!actions) {
      actions = {};
      // actions.context = this;
      this.actionDispatcherMap.set(ActionsType, actions);
      // this.injectDependencies(actions);
      for (const actionName in ActionsType) {
        // eslint-disable-next-line no-prototype-builtins
        if (ActionsType.hasOwnProperty(actionName)) {
          const actionCreator = ActionsType[actionName].bind(ActionsType);
          actions[actionName] = (...args: any[]) => {
            const action = actionCreator(...args);
            if (typeof action === 'object') {
              this.dispatch(action);
            } else if (typeof action === 'function') {
              action(this.dispatch);
            }
          };
        }
      }
    }
    return actions;
  }

  getMiddlewareAdapter(): Function {
    const t = this;
    return function m(_ref: any) {
      t.dispatch = _ref.dispatch;
      return function dashboardMiddleware(next: any): Function {
        return function handleDashboardAction(action: any): any {
          const state = t.getCurrentState(null);
          const returnVal = next(action);
          const newState = t.getCurrentState(null);
          if (state !== newState) {
            // action changed state
            const changedBranches: string[] = [];
            Object.keys(newState).forEach(key => {
              if (newState[key] !== state[key]) {
                changedBranches.push(key);
              }
            });
            t.__storeBranchesChanged(changedBranches, action, newState, state);
          }
          return returnVal;
        };
      };
    };
  }

  __storeBranchesChanged(
    branchesWithChanges: string[],
    action: any,
    state: any,
    oldState: any
  ): void {
    this.storeChangeListeners.forEach(storeChangeListener =>
      storeChangeListener(branchesWithChanges, action, state, oldState)
    );
    // console.log(branchesWithChanges, ' changed by ', action.type);
  }

  addStoreChangeListener(
    listener: (
      branchesWithChanges: string[],
      action: any,
      state: any,
      oldState: any
    ) => void
  ) {
    this.storeChangeListeners.push(listener);
  }

  setStore(store: Store<any, AnyAction>): void {
    this.store = store;
  }

  getCurrentState(selector?: Function): any {
    return selector ? selector(this.store.getState()) : this.store.getState();
  }
}

export const DashboardReactContext: React.Context<DashboardContext> = React.createContext(
  new DashboardContext()
);

export function InjectService(
  type: any
): (type: any, property: string) => void {
  return (o: any, property: string): void => {
    if (!o.serviceMemberVars) {
      // eslint-disable-next-line no-param-reassign
      o.serviceMemberVars = {};
      // eslint-disable-next-line no-prototype-builtins
    } else if (!o.hasOwnProperty('serviceMemberVars')) {
      o.serviceMemberVars = _.clone(o.serviceMemberVars);
    }
    // eslint-disable-next-line no-param-reassign
    o.serviceMemberVars[property] = type;
  };
}

export function InjectActions(
  type: any
): (type: any, property: string) => void {
  return (o: any, property: string): void => {
    if (!o.actionsMemberVars) {
      // eslint-disable-next-line no-param-reassign
      o.actionsMemberVars = {};
    }
    // eslint-disable-next-line no-param-reassign
    o.actionsMemberVars[property] = type;
  };
}

export function InjectActionDispatcher(
  type: any
): (type: any, property: string) => void {
  return (o: any, property: string): void => {
    if (!o.actionDispatcherMemberVars) {
      o.actionDispatcherMemberVars = {};
    }
    o.actionDispatcherMemberVars[property] = type;
  };
}

export function Action(o: any, methodName: string): void {
  if (!o.actionCreatorList) {
    o.actionCreatorList = [];
  }
  o.actionCreatorList.push(methodName);
}

export function useService<S>(service: any): S {
  const contextRef: DashboardContext = React.useContext<DashboardContext>(
    DashboardReactContext
  );

  return contextRef.getServiceInstance(service);
}

export function useActions<S>(action: any): S {
  const contextRef: DashboardContext = React.useContext<DashboardContext>(
    DashboardReactContext
  );
  return contextRef.getActionsInstance(action);
}

export function useActionDispatcher<S>(action: any): S {
  const contextRef: DashboardContext = React.useContext<DashboardContext>(
    DashboardReactContext
  );
  return contextRef.getActionDispatcher(action);
}

/* export function DependencyInjector<Service>(component: any): any {
  const originalRender = component.prototype.render;
  // eslint-disable-next-line no-param-reassign
  component.prototype.render = function render(
    ...args: any[]
  ): React.ReactNode {
    return (
      <DashboardReactContext.Consumer>
        {(dashboardContext: DashboardContext): React.ReactNode => {
          // eslint-disable-next-line
          if (!this.dashboardContext) {
            this.dashboardContext = dashboardContext; // eslint-disable-line
            dashboardContext.injectDependencies(this);
          }
          // this.render = originalRender; // eslint-disable-line
          return originalRender.apply(this, args);
        }}
      </DashboardReactContext.Consumer>
    );
  };
  return component;
} */

/* export class DashboardReactComponent<
  P = {},
  S = {},
  SS = {}
> extends React.Component<P, S, SS> {
  context: DashboardContext;

  public initialize = () => {
    if (this.context) {
      this.context.injectDependencies(this);
    }
  };

  constructor(props: any) {
    super(props);
    this.context = props.dashboardContext;
  }
} */

export function DependencyInjector<Service>(Component: any): any {
  const _render = Component.prototype.render;
  Component.prototype.render = function render(...args: any[]) {
    if (this.context !== this.props.dashboardContext) {
      this.context = this.props.dashboardContext;
      this.context.injectDependencies(this);
    }
    return _render.apply(this, args);
  };

  return class ComponentComposition extends React.Component {
    doNothing() {
      return true;
    }

    render() {
      // Wraps the input component in a container
      return (
        <DashboardReactContext.Consumer>
          {(dashboardContext: DashboardContext): React.ReactNode => {
            return (
              <Component {...this.props} dashboardContext={dashboardContext} />
            );
          }}
        </DashboardReactContext.Consumer>
      );
    }
  };
}

/* class RestService extends Service {
  nothing = 0;
                           
  initService(): void {
    // test
    this.nothing = 0;
  }

  callSomething(): void {
    this.nothing = 0;
    // eslint-disable-next-line no-alert
    alert('Testing inject service');
  }
}

class SampleService extends Service {
  @InjectService(RestService)
  restService: RestService;

  initService(): void {
    this.restService.callSomething();
  }
}

@ServiceInjector
export class ComponentWithServices extends React.Component {
  componentName: string = 'default';

  @InjectService(SampleService)
  sampleService: SampleService;

  callSampleService(e: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    e.preventDefault();
    this.sampleService.restService.callSomething();
  }

  render(): React.ReactNode {
    return (
      <button type="button" onClick={(e): void => this.callSampleService(e)}>
        Invoke service function
      </button>
    );
  }
} */
