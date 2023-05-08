function TopBar({ title, userId }: { title: string; userId: string }) {
  return (
    <div className="topbar-container">
      <div>
        <h3>{title}</h3>
      </div>
      {title === "북마크" ? <p>{userId}</p> : null}
    </div>
  );
}

export default TopBar;
