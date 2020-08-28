import {TAppState} from "../redux/redux-store"

export const getIsLoadingS = (state: TAppState): boolean => state.app.isLoading
