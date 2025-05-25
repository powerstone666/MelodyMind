// This is a minimal working JSX return block for MelodyMind Innersongs
// Use this as a reference for correct block closing
function Example() {
  return (
    <div>
      {true ? (
        <div>
          {true ? (
            <div>
              {true && (
                <div>Desktop Song</div>
              )}
              {true && (
                <div>Desktop Lyric</div>
              )}
            </div>
          ) : (
            <div>
              {true && (
                <div>Mobile Song</div>
              )}
              {true && (
                <div>Mobile Lyric</div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>Skeleton</div>
      )}
    </div>
  );
}
