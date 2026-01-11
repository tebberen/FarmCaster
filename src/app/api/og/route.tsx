import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Dynamic Data ---
    const username = searchParams.has('username') ? searchParams.get('username') : 'teberen';
    const date = new Date();
    const monthYear = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    // --- Mock Data & Logic ---
    const MOCK_PLANTS = [
      '🌱', '', '🌻', '', '🌲', '', '🌱',
      '', '🌲', '', '🌻', '🌱', '', '🌻',
      '🌲', '', '🌱', '', '', '🌲', '🌻',
      '🌱', '🌻', '', '🌲', '', '🌱', '',
      '', '🌲', '🌻', '🌱', '', '', '🌲',
    ];

    // Helper to chunk the array into rows for flexbox layout
    const chunkArray = (arr: any[], size: number) =>
      Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
      );

    const plantRows = chunkArray(MOCK_PLANTS, 7);

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#fefce8',
            padding: '40px',
            fontFamily: '"sans-serif"',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', fontSize: 60, fontWeight: 700, color: '#713f12' }}>
            {monthYear}
          </div>
          <div style={{ marginTop: 10, fontSize: 30, color: '#a16207' }}>
            Farmcaster Garden
          </div>

          {/* Calendar Flexbox Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column', // Rows will be stacked vertically
              gap: '12px',
              marginTop: '40px',
              width: '1050px',
              height: '420px',
              border: '3px solid #fde68a',
              borderRadius: '12px',
              padding: '12px',
              backgroundColor: '#fef3c7'
            }}
          >
            {plantRows.map((row, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  display: 'flex',
                  flexDirection: 'row', // Items in a row are horizontal
                  gap: '12px',
                  flex: 1, // Each row takes equal height
                }}
              >
                {row.map((plant: string, cellIndex: number) => (
                  <div
                    key={cellIndex}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 50,
                      backgroundColor: '#fffbeb',
                      borderRadius: '6px',
                      border: '2px solid #fde68a',
                      flex: 1, // Each cell takes equal width
                    }}
                  >
                    {plant}
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div style={{ display: 'flex', marginTop: 'auto', fontSize: 28, color: '#713f12' }}>
            <span style={{ fontWeight: 'bold' }}>@{username}</span>
            <span style={{ marginLeft: 20 }}>#Farmcaster</span>
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
