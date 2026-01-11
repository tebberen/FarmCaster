import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.has('username') ? searchParams.get('username') : 'teberen';

    // --- Calendar & Date Logic for January 2026 ---
    const year = 2026;
    const month = 0; // January
    const monthName = 'January';
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // --- Dynamic User Data (Mocked for Jan 1-11, 2026) ---
    const userPlantData: { [key: number]: string } = {
      1: '🌱', 3: '🌻', 5: '🌲', 7: '🌱', 9: '🌲', 11: '🌻',
    };

    // --- Calendar Generation ---
    const calendarCells = [];
    // 1. Add empty cells for days before the 1st of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      calendarCells.push(
        <div key={`empty-${i}`} style={{ display: 'flex', flex: '1 1 0%', height: '100%' }} />
      );
    }

    // 2. Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const emoji = (day <= 11 && userPlantData[day]) ? userPlantData[day] : '';
      calendarCells.push(
        <div
          key={day}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: '1 1 0%',
            height: '100%',
            backgroundColor: 'white',
            borderRadius: '12px',
            border: '1px solid #E5E7EB',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: '5px', right: '10px', fontSize: '20px', color: '#9CA3AF', fontWeight: 'bold' }}>
            {day}
          </div>
          {emoji && <div style={{ fontSize: '50px' }}>{emoji}</div>}
        </div>
      );
    }

    // Chunk the cells into rows of 7 for the flexbox layout
    const rowsOfCells = [];
    for (let i = 0; i < calendarCells.length; i += 7) {
        rowsOfCells.push(calendarCells.slice(i, i + 7));
    }
    // Fill the last row with empty divs if it's not full
    const lastRow = rowsOfCells[rowsOfCells.length - 1];
    if (lastRow.length < 7) {
      for (let i = lastRow.length; i < 7; i++) {
        lastRow.push(<div key={`fill-${i}`} style={{ display: 'flex', flex: '1 1 0%', height: '100%' }} />);
      }
    }

    const calendarRows = rowsOfCells.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', flexDirection: 'row', flex: '1 1 0%', gap: '10px' }}>
            {row}
        </div>
    ));


    const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: '#FFF9E3',
            padding: '40px',
            fontFamily: 'sans-serif',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, color: '#4A5568' }}>
            {`${monthName} ${year}`}
          </div>
          <div style={{ marginTop: 10, fontSize: 30, color: '#718096' }}>
            @{username}&apos;s Garden
          </div>

          {/* Calendar Container */}
          <div style={{ display: 'flex', flexDirection: 'column', width: '1050px', marginTop: '30px', gap: '10px' }}>
            {/* Day of the Week Headers */}
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-around', width: '100%', paddingBottom: '10px' }}>
              {dayHeaders.map((day) => (
                <div key={day} style={{ display: 'flex', justifyContent: 'center', flex: '1 1 0%', fontSize: '24px', fontWeight: 'bold', color: '#718096' }}>
                  {day}
                </div>
              ))}
            </div>
            {/* Calendar Days Flexbox Container */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', height: '420px' }}>
              {calendarRows}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      },
    );
  } catch (e: any) {
    console.error(`Failed to generate OG image: ${e.message}`);
    return new Response(`Failed to generate OG image`, { status: 500 });
  }
}
