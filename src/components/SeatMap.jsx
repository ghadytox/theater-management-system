export default function SeatMap({ seats, selected, onSelect }) {
  const rows = [...new Set(seats.map((s) => s.row))];

  return (
    <div>
      <div className="d-flex gap-3 mb-3 flex-wrap">
        {[['available', 'bg-success', 'Available'],
          ['booked', 'bg-danger', 'Booked'],
          ['selected', 'bg-warning', 'Selected']].map(([key, cls, label]) => (
          <span key={key} className="d-flex align-items-center gap-1 small">
            <span className={`${cls} rounded`} style={{ width: 18, height: 18, display: 'inline-block' }} />
            {label}
          </span>
        ))}
      </div>

      <div className="p-3 bg-light rounded border text-center mb-2">
        <strong>🎬 STAGE</strong>
      </div>

      {rows.map((row) => (
        <div key={row} className="d-flex align-items-center gap-1 mb-1">
          <span className="fw-bold me-2" style={{ width: 20 }}>{row}</span>
          {seats.filter((s) => s.row === row).map((seat) => {
            const isSelected = selected.includes(seat.id);
            const isBooked = seat.status === 'booked';
            return (
              <button
                key={seat.id}
                disabled={isBooked}
                onClick={() => onSelect(seat.id)}
                className={`btn btn-sm p-0 ${isBooked ? 'btn-danger' : isSelected ? 'btn-warning' : 'btn-success'}`}
                style={{ width: 32, height: 32, fontSize: 10 }}
                title={`${seat.row}${seat.number}`}
              >
                {seat.number}
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
