function ResultItem({ label, value }) {
  return (
    <div className="resultItem">
      <div className="resultLabel">{label}</div>
      <div className="resultValue">{String(value)}</div>
    </div>
  );
}

export default function TrafficDecisionResult({ result }) {
  if (!result) return null;

  const counts = result.vehicle_counts || {};

  return (
    <div className="card">
      <h2 className="sectionTitle">Result</h2>

      <div className="resultGrid">
        <ResultItem label="Action" value={result.action ?? '-'} />
        <ResultItem label="Green direction" value={result.green_direction ?? '-'} />
        <ResultItem label="Duration (sec)" value={result.duration ?? '-'} />
      </div>

      <h2 className="sectionTitle" style={{ marginTop: 16 }}>
        Vehicle counts
      </h2>

      <div className="countsGrid">
        <ResultItem label="North" value={counts.north ?? '-'} />
        <ResultItem label="South" value={counts.south ?? '-'} />
        <ResultItem label="East" value={counts.east ?? '-'} />
        <ResultItem label="West" value={counts.west ?? '-'} />
      </div>

      <details className="rawBox">
        <summary className="rawSummary">Raw JSON</summary>
        <pre className="rawPre">{JSON.stringify(result, null, 2)}</pre>
      </details>
    </div>
  );
}
