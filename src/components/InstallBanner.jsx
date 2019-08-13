import React, { useState, useEffect, useCallback } from 'react';
import { Button, IconButton, AppBar, Toolbar } from '@material-ui/core';
import { Close, GetApp } from '@material-ui/icons';

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  const beforeInstall = useCallback((e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    console.log('Before install prompt!');
    setDeferredPrompt(e);
  }, []);

  const postInstall = useCallback(() => {
    console.log('Post install');
    setDeferredPrompt(null);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', beforeInstall);
    window.addEventListener('appinstalled', postInstall);
    console.log('added eventlisteners');

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstall);
      window.removeEventListener('appinstalled', postInstall);
      console.log('removed eventlisteners');
    }
  }, [beforeInstall, postInstall]);

  const onInstall = () => {
    console.log('clicked on install');
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
  };

  let appBarStyle = {
    display: 'none',
    backgroundColor: 'lightgrey'
  };

  if (deferredPrompt) {
    appBarStyle.display = 'block';
  }

  return (
    <AppBar position='static' style={appBarStyle}>
      <Toolbar style={toolbarStyle}>
        <Button id='install-button' color='primary' style={{ textTransform: 'none' }} onClick={onInstall}>
          <GetApp style={{ paddingRight: '10px' }} />
            Add Wthr to Home screen
        </Button>
        <IconButton onClick={closeBanner}><Close /></IconButton>
      </Toolbar>
    </AppBar>
  );
};

const toolbarStyle = {
  justifyContent: 'space-between', 
  minHeight: '40px'
};