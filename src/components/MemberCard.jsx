import React from "react";

function MemberCard({ member }) {
  return (
    <div className="member-card">
      <img src={member.image} alt={member.name} />
      <h3>{member.name}</h3>
    </div>
  );
}

export default MemberCard;
