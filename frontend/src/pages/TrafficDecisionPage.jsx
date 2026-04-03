import { useMemo, useState } from 'react';
import { submitTrafficDecision } from '../api/trafficDecision.js';
import VideoPickerRow from '../components/VideoPickerRow.jsx';
import TrafficDecisionResult from '../components/TrafficDecisionResult.jsx';
import { DIRECTIONS } from '../constants/directions.js';

function makeEmptyFiles() {
  return {
    north: null,
    south: null,
    east: null,
    west: null,
  };
}

function isVideoFile(file) {
  if (!file) return false;
  return typeof file.type === 'string' && file.type.startsWith('video/');
}

export default function TrafficDecisionPage() {
  const [files, setFiles] = useState(() => makeEmptyFiles());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const canSubmit = useMemo(() => {
    return (
      !isSubmitting &&
      DIRECTIONS.every((d) => files[d.key] instanceof File)
    );
  }, [files, isSubmitting]);

  function setFile(directionKey, file) {
    setError('');
    setResult(null);

    if (!file) {
      setFiles((prev) => ({ ...prev, [directionKey]: null }));
      return;
    }

    if (!isVideoFile(file)) {
      setError('Please select only video files (mp4, avi, etc.).');
      return;
    }

    setFiles((prev) => ({ ...prev, [directionKey]: file }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setResult(null);

    const missing = DIRECTIONS.filter((d) => !(files[d.key] instanceof File));
    if (missing.length > 0) {
      setError('Please select all 4 videos (north, south, east, west).');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await submitTrafficDecision(files);
      setResult(data);
    } catch (err) {
      setError(err?.message || 'Upload failed');
    } finally {
      setIsSubmitting(false);
    }
  }

  function onReset() {
    setFiles(makeEmptyFiles());
    setError('');
    setResult(null);
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <div>
            <h1 className="title">Traffic AI</h1>
            <p className="subtitle">Upload 4 direction videos and get the signal decision.</p>
          </div>
          <div className="headerRight">
            <span className="pill">POST /traffic-decision</span>
          </div>
        </header>

        <div className="card">
          <h2 className="sectionTitle">Upload videos</h2>
          <form onSubmit={onSubmit}>
            <div className="rows">
              {DIRECTIONS.map((d) => (
                <VideoPickerRow
                  key={d.key}
                  directionKey={d.key}
                  label={d.label}
                  file={files[d.key]}
                  disabled={isSubmitting}
                  onChange={setFile}
                />
              ))}
            </div>

            {error ? <div className="alert">{error}</div> : null}

            <div className="actions">
              <button className="button buttonPrimary" type="submit" disabled={!canSubmit}>
                {isSubmitting ? 'Processing…' : 'Upload & Process'}
              </button>
              <button className="button" type="button" disabled={isSubmitting} onClick={onReset}>
                Reset
              </button>
            </div>

            <p className="hint">
              Tip: Start your backend on <span className="mono">localhost:3000</span>. This UI uses a Vite proxy,
              so it calls the backend as <span className="mono">/traffic-decision</span>.
            </p>
          </form>
        </div>

        <div className="spacer" />

        <TrafficDecisionResult result={result} />
      </div>
    </div>
  );
}
