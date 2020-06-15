import {TAppState} from "./redux-store";

export const getIsLoadingS = (state: TAppState) => state.app.isLoading;
