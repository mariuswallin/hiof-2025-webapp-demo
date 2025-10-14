import type { RequestInfo } from "rwsdk/worker";
import { tasksService } from "../tasksService";

export default async function TaskListPage(props: RequestInfo) {
  const { request } = props;
  const searchParams = new URL(request.url).searchParams;
  const { published } = Object.fromEntries(searchParams.entries());

  const tasks = await tasksService.list({ published });
  return <div>{JSON.stringify(tasks)}</div>;
}
