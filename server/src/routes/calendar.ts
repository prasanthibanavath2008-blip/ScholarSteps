import { Router } from 'express';
import { demoStore } from '../services/store';

export const calendarRouter = Router();

calendarRouter.get('/events', (req, res) => {
  const scholarships = demoStore.getAllScholarships();
  const events = scholarships
    .filter((s) => s.deadlineDate)
    .map((s) => ({
      id: `evt-${s.id}`,
      title: `${s.name} - Official Deadline`,
      provider: s.provider.name,
      date: s.deadlineDate,
      deadlineType: s.deadlineType,
      url: s.officialPortalUrl,
      notes: s.deadlineNotes,
    }));

  res.json({ data: events, meta: { requestId: req.headers['x-request-id'] || 'req-id' } });
});

calendarRouter.get('/export.ics', (req, res) => {
  const scholarships = demoStore.getAllScholarships().filter((s) => s.deadlineDate);

  let icsContent = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//NextStep Rebels//ScholarSteps//EN\r\nCALSCALE:GREGORIAN\r\n`;

  for (const s of scholarships) {
    const d = s.deadlineDate.replace(/-/g, '');
    icsContent += `BEGIN:VEVENT\r\nUID:${s.id}@scholarsteps.org\r\nDTSTAMP:${d}T000000Z\r\nDTSTART;VALUE=DATE:${d}\r\nSUMMARY:${s.name} Application Deadline\r\nDESCRIPTION:Official Application Deadline for ${s.name} (${s.provider.name}). Source link: ${s.officialPortalUrl}\r\nURL:${s.officialPortalUrl}\r\nSTATUS:CONFIRMED\r\nEND:VEVENT\r\n`;
  }

  icsContent += `END:VCALENDAR\r\n`;

  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="scholarsteps-calendar.ics"');
  res.send(icsContent);
});

