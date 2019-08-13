import React, { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, AppBar, Toolbar } from '@material-ui/core';
import { Close } from '@material-ui/icons';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [hiddenForIOS, setHiddenForIOS] = useState(false);

  const beforeInstall = useCallback((e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    setDeferredPrompt(e);
  }, []);

  const postInstall = useCallback(() => {
    setDeferredPrompt(null);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', postInstall);

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', postInstall);
    }
  }, [beforeInstall, postInstall]);

  const onInstall = () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the prompt
    let dp = deferredPrompt;
    dp.prompt();
    // Wait for the user to respond to the prompt
    dp.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
  };

  const closeBanner = (e) => {
    setDeferredPrompt(null);
    setHiddenForIOS(true);
  };

  let appBarStyle = {
    display: 'none',
    backgroundColor: 'lightgrey'
  };

  if (deferredPrompt || (showIOSBanner() && !hiddenForIOS)) {
    appBarStyle.display = 'block';
  }

  return (
    <AppBar position='static' style={appBarStyle}>
      <Toolbar style={toolbarStyle}>
        { showIOSBanner() ? <IOSMessage /> : <InstallMessage onClick={onInstall} />}
        <IconButton onClick={closeBanner}><Close /></IconButton>
      </Toolbar>
    </AppBar>
  );
};

const InstallMessage = (props) => {
  return (
    <Button id='install-button' color='primary' style={{ textTransform: 'none' }} onClick={props.onClick} >
      <img src='wthr-fat.svg' width='24px' height='24px' style={{ paddingRight: '10px' }} alt='Wthr icon'/>
      Add Wthr to Home screen
    </Button>
  );
};

const IOSMessage = () => {
  return (
    <>
    <img src='wthr-fat.svg' height='24px' width='24px' style={{ paddingRight: '10px' }} alt='Wthr icon'/>
    <p style={{color: 'darkblue' }}>Install Wthr on your iOS-device: tap the sharebutton and then 'Add to homescreen'</p>
    </>
  );
};

const toolbarStyle = {
  justifyContent: 'space-between',
  minHeight: '40px'
};

const showIOSBanner = () => {
  return isIos() && !isInStandaloneMode();
};

const isIos = () => {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

const isInStandaloneMode = () => ('standalone' in window.navigator) && (window.navigator.standalone);