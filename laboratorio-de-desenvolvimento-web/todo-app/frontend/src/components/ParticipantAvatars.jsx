import { getInitials } from "../utils/getInitials.js";

const MAX_VISIBLE = 3;

export default function ParticipantAvatars({ participants = [] }) {
  if (participants.length === 0) return null;

  const visibleParticipants = participants.slice(0, MAX_VISIBLE);
  const extraCount = participants.length - MAX_VISIBLE;
  const allNames = participants.map((participant) => participant.name).join(", ");

  return (
    <div className="flex items-center gap-2" title={`Participants: ${allNames}`}>
      <span className="font-medium text-gray-700 hidden sm:inline">Equipe:</span>

      <div className="flex -space-x-2 overflow-hidden">
        {visibleParticipants.map((participant) => (
          <div
            key={participant._id}
            title={participant.name}
            className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-blue-500 text-white font-semibold border-2 border-white text-[10px]"
          >
            {getInitials(participant.name)}
          </div>
        ))}

        {extraCount > 0 && (
          <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-200 text-gray-700 font-bold border-2 border-white text-[10px]">
            +{extraCount}
          </div>
        )}
      </div>
    </div>
  );
}