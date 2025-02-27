import type { Location, Action, History } from 'history';

export const CALL_HISTORY_METHOD = '@@router/CALL_HISTORY_METHOD';
export const LOCATION_CHANGE = '@@router/LOCATION_CHANGE';

//support history v4/ v5
export type HistoryMethods =
   | 'push'
   | 'replace'
   | 'go'
   | 'goBack'
   | 'goForward'
   | 'back'
   | 'forward';

export const locationChangeAction = (location: Location, action: Action) => ({
   type: LOCATION_CHANGE as typeof LOCATION_CHANGE,
   payload: { location, action } as { location: Location; action: Action },
});

export interface LocationActionPayload<A = unknown[]> {
   method: string;
   args?: A;
}

export interface CallHistoryMethodAction<A = unknown[]> {
   type: typeof CALL_HISTORY_METHOD;
   payload: LocationActionPayload<A>;
}

function updateLocation<T extends HistoryMethods>(method: T) {
   // @ts-ignore //support history 5.x back/forward
   return (...args: Parameters<History[T]>): CallHistoryMethodAction<Parameters<History[T]>> => ({
      type: CALL_HISTORY_METHOD as typeof CALL_HISTORY_METHOD,
      payload: { method, args },
   });
}

export function push<S = History.LocationState>(
   ...args: Parameters<History<S>['push']>
): CallHistoryMethodAction<Parameters<History['push']>> {
   return updateLocation('push')(...args);
}
export function replace<S = History.LocationState>(
   ...args: Parameters<History<S>['replace']>
): CallHistoryMethodAction<Parameters<History['replace']>> {
   return updateLocation('replace')(...args);
}
export const go: (
   ...args: Parameters<History['go']>
) => CallHistoryMethodAction<Parameters<History['go']>> = updateLocation('go');
export const goBack: () => CallHistoryMethodAction<Parameters<History['goBack']>> =
   updateLocation('goBack');
export const goForward: () => CallHistoryMethodAction<Parameters<History['goForward']>> =
   updateLocation('goForward');
// @ts-ignore //support history 5.x back/forward
export const back: () => CallHistoryMethodAction<Parameters<History['back']>> =
   updateLocation('back');
// @ts-ignore //support history 5.x back/forward
export const forward: () => CallHistoryMethodAction<Parameters<History['forward']>> =
   updateLocation('forward');

export type RouterActions =
   | ReturnType<typeof push>
   | ReturnType<typeof replace>
   | ReturnType<typeof go>
   | ReturnType<typeof goBack>
   | ReturnType<typeof goForward>
   | ReturnType<typeof locationChangeAction>
   | ReturnType<typeof back>
   | ReturnType<typeof forward>;
