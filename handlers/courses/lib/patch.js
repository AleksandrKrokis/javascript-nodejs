"use strict";

const CourseParticipant = require('../models/courseParticipant');
const CourseInvite = require('courses').CourseInvite;
const _ = require('lodash');
const sendOrderInvites = require('./sendOrderInvites');
const Order = require('payments').Order;

// called by payments/common/order
module.exports = function*() {

  //var group = yield CourseGroup.findById(this.order.data.group).exec();
  let participants = yield CourseParticipant.find({
    group: this.order.data.group
  }).populate('user');

  let participantsByEmail = _.indexBy(participants, function(participant) {
    return participant.user.email;
  });

  const invitesAccepted = yield CourseInvite.find({
    order: this.order._id,
    accepted: true
  });

  const invitesAcceptedByEmail = _.indexBy(invitesAccepted, 'email');

  if ("emails" in this.request.body) {

    let emails = _.unique(this.request.body.emails.split(',').filter(Boolean));

    this.log.debug("Incoming emails", emails);

    // ignore the email if it's a participant (old orders, invite had no order) OR invite was accepted
    emails = emails.filter(function throwAwayParticipantsInSubmitted(email) {
      return !(email in participantsByEmail) && !(email in invitesAcceptedByEmail);
    });

    this.log.debug("Incoming emails except participants", emails);

    // create a new emails list
    // first, take participants from the order:
    let newEmails = this.order.data.emails.filter(function keepParticipantsInOrder(email) {
      return email in participantsByEmail;
    });

    this.log.debug("Order participant emails", newEmails);

    // second, add new (non-participating see above) emails
    newEmails = newEmails.concat(emails);

    this.log.debug("Order new emails", newEmails);

    // should never happen (handwired request)
    if (newEmails.length > this.order.data.count) {
      this.throw(400, "Too many emails.");
    }

    this.order.data.emails = newEmails;
  }

  if ("contactName" in this.request.body) {
    this.order.data.contactName = this.request.body.contactName;
  }

  if ("contactPhone" in this.request.body) {
    this.order.data.contactPhone = this.request.body.contactPhone;
  }

  this.order.markModified('data');

  if (this.isAdmin) {
    if ("amount" in this.request.body) {
      this.order.amount = this.request.body.amount;
    }

    if ("currency" in this.request.body) {
      this.order.currency = this.request.body.currency;
    }

    if ("status" in this.request.body) {
      this.order.status = this.request.body.status;
    }
  }

  yield this.order.persist();


  let invites = [];
  if (this.order.status == Order.STATUS_SUCCESS) {
    invites = yield* sendOrderInvites(this.order);
  }

  if (invites.length) {
    let emails =  _.pluck(invites, 'email');
    this.body = 'Информация обновлена, приглашения высланы на адреса: ' + emails.join(", ") + '.';
  } else {
    this.body = 'Информация об участниках обновлена.';
  }
};

