import React from 'react';

interface RedirectState {
    should: boolean;
    to: string;
}

interface Redirect {
    redirect: {
        should: boolean;
        to: string;
    };
    setRedirect: (redirect: RedirectState) => void;
    setShouldRedirect: (should: boolean) => void;
    setToRedirect: (to: string) => void;
}

export const useRedirect = (to: string): Redirect => {
    const [redirect, setRedirect] = React.useState({should: false, to});
    const setShouldRedirect = React.useCallback((should: boolean) => {
        setRedirect({ ...redirect, should });
    }, [redirect]);
    const setToRedirect = React.useCallback((to: string) => {
        setRedirect({ ...redirect, to });
    }, [redirect]);

    return {
        redirect,
        setRedirect,
        setShouldRedirect,
        setToRedirect
    };
}