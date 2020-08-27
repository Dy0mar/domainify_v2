import {TAppState} from "../redux/redux-store"


export const getIsLoadingS = (state: TAppState) => state.app.isLoading
