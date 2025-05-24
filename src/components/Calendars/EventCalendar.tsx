/*!

=========================================================
* Purity UI Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard-pro
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import FullCalendar from '@fullcalendar/react'; // must go before plugins
import React from 'react';
import dayGridPlugin from '@fullcalendar/daygrid'; // a plugin!
import interactionPlugin from '@fullcalendar/interaction'; // needed for dayClick

type EventCalendarProps = {
  calendarData: Array<any>;
  initialDate: string;
};

function EventCalendar(props: EventCalendarProps) {
  const { calendarData, initialDate } = props;

  return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      headerToolbar={false}
      initialView="dayGridMonth"
      contentHeight="600"
      events={calendarData}
      initialDate={initialDate}
      editable={true}
      minHeight="400px"
      height="100%"
      slotWidth={10}
      customIcons={false}
    />
  );
}

export default EventCalendar;
