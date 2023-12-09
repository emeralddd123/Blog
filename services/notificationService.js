const { MessagingTopicManagementResponse } = require('firebase-admin/lib/messaging/messaging-api');
const firebaseMessaging = require('../config/firebase.config');
const tokenModel = require('../models/token.model');


const sendAllNotificationService = async (notification) => {
  try {
    const tokens = await tokenModel.find();
    const registrationTokens = tokens.map((token) => token.token);

    if (registrationTokens.length === 0) {
      throw new Error('No tokens found');
    }

    const message = {
      notification: {
        title: notification.title || 'Notification Title',
        body: notification.body || 'Notification Body',
      },
      tokens: registrationTokens,
    };

    const response = await firebaseMessaging.sendMulticast(message);

    return response;
  } catch (error) {
    throw new Error(error?.message || 'Internal server error !');
  }
};


const sendNotificationToTokenService = async (token, notification) => {
  try {
    const message = {
      notification: {
        title: notification.title || 'Notification Title',
        body: notification.body || 'Notification Body',
      },
      token,
    };

    const response = await firebaseMessaging.send({
      ...message,
      webpush: {
        notification: {
          icon: 'https://www.google.com/favicon.ico',
          title: 'Notification Title',
          body: 'Notification Body',
        },
      },
    });

    return response;
  } catch (error) {
    throw new Error(error?.message || 'Internal server error !');
  }
};


const sendNotificationToTopicService = async (topic, notification) => {
  try {
    const message = {
      notification: {
        title: notification.title || 'Notification Title',
        body: notification.body || 'Notification Body',
      },
      topic,
    };

    const response = await firebaseMessaging.send(message);

    return response;
  } catch (error) {
    throw new Error(error?.message || 'Internal server error !');
  }
};


const subscribeToTopicService = async (token, topic) => {
  try {
    const response = await firebaseMessaging.subscribeToTopic(token, topic);
    return response;
  } catch (error) {
    throw new Error(error?.message || 'Internal server error !');
  }
};


const unSubscribeToTopicService = async (token, topic) => {
  try {
    const response = await firebaseMessaging.unsubscribeFromTopic(token, topic);
    return response;
  } catch (error) {
    throw new Error(error?.message || 'Internal server error !');
  }
};


module.exports = {
  sendAllNotificationService,
  sendNotificationToTokenService,
  sendNotificationToTopicService,
  subscribeToTopicService,
  unSubscribeToTopicService,
};
