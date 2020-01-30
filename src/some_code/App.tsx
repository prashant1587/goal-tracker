/* eslint-disable react/prefer-stateless-function */
import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React, { ReactNode, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Route,
  RouteComponentProps
} from 'react-router-dom';
import { Provider } from 'react-redux';
import './i18n';
import './register-icons.tsx';
import ThemesService from 'services/themes.service';
import { ComponentContext } from '_external/copernicus/PluginComponent';
import { cloneDeep } from 'lodash';
import { createBrowserHistory, History } from 'history';
import {
  DashboardReactContext,
  DashboardContext
} from './services/dashboard-context';
import Backend from './api/Backend';
// @ts-ignore
import DataWorker from './worker/data.worker'; // eslint-disable-line
import DashboardContainer from './components/dashboard-container/dashboard-container.container';
import getNewStore from './configurations/configure-store';
import './App.scss';
import { FilterAPI } from './_external/filters/filterAPI';

export interface MashzoneAppProps {
  width?: number;
  height?: number;
  yukon?: ComponentContext;
  yukonFilterHandler?: FilterAPI;
  dashboardId?: string;
  preview?: boolean;
  editmode?: boolean;
  dashboardParameters?: { [key: string]: string };
  attributesModified?: Function;
  autoPersistStrategy?: 'LOCAL' | 'SERVER';
  enableLocalStoreCompression?: boolean;
  enableLocalStoreBranching?: boolean;
}

export class MashzoneStandAlone extends React.Component {
  dashboardGuid: string;

  dashboardActiveTab: string;

  dashboardParameters: { [key: string]: string } = {};

  autoPersistStrategy: 'LOCAL' | 'SERVER';

  enableLocalStoreCompression: boolean;

  enableLocalStoreBranching: boolean;

  preview: boolean;

  editmode: boolean;

  queryParamRegEx = /[?&]([^&=]*)=([^&]*)/g;

  queryString: string;

  queryParamsObject: { [key: string]: any } = {};

  hashFragment: string;

  hashParamsObject: { [key: string]: any } = {};

  history = createBrowserHistory({
    forceRefresh: true
  });

  attributesModified(
    attributes: { [key: string]: string | string[] },
    history: History<any>
  ) {
    //
    let { search } = history.location;
    let { hash } = history.location;
    let attr;
    if (hash) {
      const parsedHash = this.parseStringToParamsObject(hash);
      let hasChanged = false;
      if (parsedHash) {
        for (attr in attributes) {
          // eslint-disable-next-line no-prototype-builtins
          if (parsedHash.hasOwnProperty(attr)) {
            parsedHash[attr] = attributes[attr];
            delete attributes[attr];
            hasChanged = true;
          }
        }
        if (hasChanged) {
          hash = hash.replace(this.queryParamRegEx, '');
          hash += this.paramsObjectToString(parsedHash);
        }
      }
    }

    const parsedSearch = search ? this.parseStringToParamsObject(search) : {};
    let hasChanged = false;
    for (attr in attributes) {
      // eslint-disable-next-line no-prototype-builtins
      if (attributes.hasOwnProperty(attr)) {
        parsedSearch[attr] = attributes[attr];
        hasChanged = true;
      }
    }
    if (hasChanged) {
      search = this.paramsObjectToString(parsedSearch);
    }

    history.push({
      pathname: history.location.pathname,
      search,
      hash
    });
  }

  paramsObjectToString(paramsObject: any) {
    const strBuffer = [];
    let prop: string;
    let propVal: string | string[];
    for (prop in paramsObject) {
      if ((propVal = paramsObject[prop])) {
        if (Array.isArray(propVal)) {
          let i;
          for (i = 0; i < propVal.length; i++) {
            strBuffer.push([prop, propVal[i]].join('='));
          }
        } else {
          strBuffer.push([prop, propVal].join('='));
        }
      }
    }
    const str = strBuffer.join('&');
    return str ? ['?', str].join('') : str;
  }

  render() {
    return (
      <Router>
        <Route
          path="/"
          render={(props: RouteComponentProps) => {
            this.processQueryParams(props.location.search, props.location.hash);
            return (
              <MashzoneApp
                dashboardId={this.dashboardGuid}
                editmode={this.editmode}
                preview={this.preview}
                dashboardParameters={this.dashboardParameters}
                attributesModified={(attributes: any) =>
                  this.attributesModified(attributes, props.history)
                }
                enableLocalStoreCompression={this.enableLocalStoreCompression}
                enableLocalStoreBranching={this.enableLocalStoreBranching}
                autoPersistStrategy={this.autoPersistStrategy}
              />
            );
          }}
        />
      </Router>
    );
  }

  processQueryParams(queryString: string, hashFragment: string) {
    // search part would not ideally change without reloading the page
    if (this.queryString !== queryString) {
      this.queryString = queryString;
      this.processParamsObject(this.queryStringToParamsObject(queryString));
    }

    if (this.hashFragment !== hashFragment) {
      this.hashFragment = hashFragment;
      this.processParamsObject(this.hashFragmentToParamsObject(hashFragment));
    }
  }

  hashFragmentToParamsObject(hashFragment: string) {
    const params = this.parseStringToParamsObject(hashFragment);
    let prop;
    for (prop in this.hashParamsObject) {
      if (!params[prop]) {
        params[prop] = [null];
      }
    }
    this.hashParamsObject = cloneDeep(params);
    return params;
  }

  queryStringToParamsObject(queryString: string) {
    const params = this.parseStringToParamsObject(queryString);
    let prop;
    for (prop in this.queryParamsObject) {
      if (!params[prop]) {
        params[prop] = [null];
      }
    }
    this.queryParamsObject = cloneDeep(params);
    return params;
  }

  parseStringToParamsObject(str: string) {
    const params = {} as any;
    let a: any;
    while ((a = this.queryParamRegEx.exec(str))) {
      if (!params[a[1]]) {
        params[a[1]] = [] as string[];
      }
      params[a[1]].push(a[2]);
    }
    return params;
  }

  processParamsObject(params: any) {
    if (params.guid) {
      [this.dashboardGuid] = params.guid;
      delete params.guid;
    }
    if (params.preview || params.preview === null) {
      this.preview =
        params.preview &&
        params.preview[0] &&
        params.preview[0].toLowerCase() === 'true';
      delete params.preview;
    }
    if (params.editmode || params.editmode === null) {
      this.editmode =
        params.editmode[0] && params.editmode[0].toLowerCase() === 'true';
      delete params.editmode;
    }
    if (params.tab || params.tab === null) {
      [this.dashboardActiveTab] = params.tab;
      delete params.tab;
    }
    if (
      params.autoPersistStrategy === 'LOCAL' ||
      params.autoPersistStrategy === 'SERVER'
    ) {
      [this.autoPersistStrategy] = params.autoPersistStrategy;
      delete params.autoPersistStrategy;
    }
    if (params.enableLocalStoreBranching) {
      this.enableLocalStoreBranching =
        params.enableLocalStoreBranching[0] &&
        params.enableLocalStoreBranching[0].toLowerCase() === 'true';
    }
    if (params.enableLocalStoreCompression) {
      this.enableLocalStoreCompression =
        params.enableLocalStoreCompression[0] &&
        params.enableLocalStoreCompression[0].toLowerCase() === 'true';
    }
    let key;
    for (key in params) {
      if (!params[key] || params[key] !== this.dashboardParameters[key]) {
        this.dashboardParameters = params;
        break;
      }
    }
  }
}

export class MashzoneApp extends React.Component<MashzoneAppProps> {
  dashboardContxt: DashboardContext;

  store: any;

  constructor(props: MashzoneAppProps) {
    super(props);
    ThemesService.loadTheme(ThemesService.DEFAULT_THEME);
    this.dashboardContxt = new DashboardContext();
    this.store = getNewStore(this.dashboardContxt.getMiddlewareAdapter());
    this.dashboardContxt.setStore(this.store);
    this.dashboardContxt.dataWorker = new DataWorker();
  }

  componentDidMount() {
    Backend.getCurrentUserName();
  }

  render(): ReactNode {
    const mzStyle = {
      width: this.props.width ? this.props.width : '100%',
      height: this.props.height ? this.props.height : '100%'
    };
    return (
      <Suspense fallback={<div>Loading...</div>}>
        <div className="MashzoneApp" style={mzStyle}>
          <DashboardReactContext.Provider value={this.dashboardContxt}>
            <Provider store={this.store}>
              <DashboardContainer {...this.props} />
            </Provider>
          </DashboardReactContext.Provider>
        </div>
      </Suspense>
    );
  }
}

export default MashzoneApp;
