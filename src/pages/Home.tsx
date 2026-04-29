export default function Home() {
  return (
    <div>
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <h1>Harmonylens</h1>
        <p>Where you feel at ease in front of the camera.</p>
      </div>

      <Masonry photos={featuredPhotos()} />
    </div>
  );
}

