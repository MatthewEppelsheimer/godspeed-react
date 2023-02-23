import { useGodspeedContextControlImmutable } from "../context";
import { GsRecord } from "../interfaces";

interface DeleteButtonProps {
	buttonLabel?: string;
	record: GsRecord;
}

function GsDeleteButton({ buttonLabel = "delete", record }: DeleteButtonProps) {
	const { uuid } = record;

	const { del } = useGodspeedContextControlImmutable().record;

	return (
		<button className="delete_button" onClick={() => del(uuid)}>
			{buttonLabel}
		</button>
	);
}

export default GsDeleteButton;
