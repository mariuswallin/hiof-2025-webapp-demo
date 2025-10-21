import type { RequestInfo } from "rwsdk/worker";
import { tasksService } from "../tasksService";

export default async function TaskDetailRSC(props: RequestInfo) {
  const { params } = props;

  const task = await tasksService.getById(params.taskId);
  return <div>{JSON.stringify(task)}</div>;
}
