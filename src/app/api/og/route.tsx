import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.has('username') ? searchParams.get('username') : 'farmcaster';

    // --- Static Date Logic for January 2026 ---
    const monthName = 'January';
    const year = 2026;
    const daysInMonth = 31;
    // January 1, 2026 is a Thursday. Day of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
    const firstDayOfWeek = 4; // Thursday

    // --- Emojis for the Garden ---
    const plantEmojis = ['🌱', '🌻', '🌲', '🌸'];
    const userPlantedDays = Array.from({ length: 11 }, (_, i) => i + 1); // User has planted on days 1-11

    const dayHeaders = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

    // --- Calendar Grid Generation ---
    const calendarDays = [];

    // 1. Add empty placeholder divs for alignment
    for (let i = 0; i < firstDayOfWeek; i++) {
      calendarDays.push(<div key={`empty-${i}`} style={{ width: 150, height: 100 }} />);
    }

    // 2. Generate divs for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isPlanted = userPlantedDays.includes(day);
      // Get a pseudo-random emoji for variety
      const emoji = isPlanted ? plantEmojis[day % plantEmojis.length] : null;

      calendarDays.push(
        <div
          key={`day-${day}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 150,
            height: 100,
            backgroundColor: 'white',
            borderRadius: 12,
            border: '1px solid #EAEAEA',
            position: 'relative',
          }}
        >
          <div style={{ position: 'absolute', top: 5, right: 10, fontSize: 22, color: '#A9A9A9' }}>
            {day}
          </div>
          {emoji && <div style={{ fontSize: 60 }}>{emoji}</div>}
        </div>
      );
    }

    // Fill the rest of the grid to make a complete 7x5 layout
    const totalCells = firstDayOfWeek + daysInMonth;
    const cellsToFill = 35 - totalCells; // 5 rows * 7 columns = 35 cells
    for (let i = 0; i < cellsToFill; i++) {
        calendarDays.push(<div key={`fill-${i}`} style={{ width: 150, height: 100 }} />);
    }

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#FEF9E7',
            padding: '40px',
            fontFamily: '"Arial Black", "Arial Bold", Gadget, sans-serif',
          }}
        >
          {/* Main Title */}
          <div style={{ fontSize: 72, fontWeight: '900', color: '#6D4C41', marginBottom: 10 }}>
            {`${monthName} ${year}`}
          </div>
          {/* Subtitle */}
          <div style={{ fontSize: 36, color: '#A1887F', marginBottom: 30 }}>
            @{username}'s Garden Wall
          </div>

          {/* Calendar Container */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: 1100,
          }}>
            {/* Day Headers */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '100%',
              paddingBottom: 10,
              marginBottom: 10,
            }}>
              {dayHeaders.map((day) => (
                <div key={day} style={{ width: 150, textAlign: 'center', fontSize: 28, color: '#8D6E63', fontWeight: 'bold' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Days Grid */}
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              justifyContent: 'space-between',
              rowGap: 10,
            }}>
              {calendarDays}
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
    console.error(`Error generating OG image: ${e.message}`);
    return new Response('Failed to generate OG image', { status: 500 });
  }
}
