export default function VideoPickerRow({
  directionKey,
  label,
  file,
  disabled,
  onChange,
}) {
  const fileLabel = file ? file.name : 'No file selected';

  return (
    <div className="row">
      <div className="rowLeft">
        <div className="rowLabel">{label} video</div>
        <div className="rowMeta">{fileLabel}</div>
      </div>

      <div className="rowRight">
        <input
          className="fileInput"
          type="file"
          accept="video/*"
          disabled={disabled}
          onChange={(e) => {
            const nextFile = e.target.files?.[0] || null;
            onChange(directionKey, nextFile);
          }}
        />
      </div>
    </div>
  );
}
