import * as planner from "./planner";
import * as refs from "../../extensions/refs";

const humanReadable = (dep: planner.InstanceSpec) =>
  `\t${dep.instanceId} (${
    dep.ref ? `${refs.toExtensionVersionRef(dep.ref)}` : `Installed from local source`
  })`;

const humanReadableUpdate = (from: planner.InstanceSpec, to: planner.InstanceSpec) => {
  if (
    from.ref?.publisherId == to.ref?.publisherId &&
    from.ref?.extensionId == to.ref?.extensionId
  ) {
    return `\t${from.instanceId} (${refs.toExtensionVersionRef(from.ref!)} => ${to.ref?.version})`;
  } else {
    const fromRef = from.ref
      ? `${refs.toExtensionVersionRef(from.ref)}`
      : `Installed from local source`;
    return `\t${from.instanceId} (${fromRef} => ${refs.toExtensionVersionRef(to.ref!)})`;
  }
};

export function createsSummary(toCreate: planner.InstanceSpec[]): string {
  return toCreate.length
    ? `The following extension instances will be created:\n${toCreate
        .map(humanReadable)
        .join("\n")}\n`
    : "";
}

export function updatesSummary(toUpdate: planner.InstanceSpec[], have: planner.InstanceSpec[]): string {
  const summary = toUpdate
    .map((to) => {
      const from = have.find((exists) => exists.instanceId == to.instanceId);
      return humanReadableUpdate(from!, to);
    })
    .join("\n");
  return toUpdate.length ? `The following extension instances will be updated:\n${summary}\n` : "";
}

export function deletesSummary(toDelete: planner.InstanceSpec[]) {
  return toDelete.length
    ? `The following extension instances are not listed in 'firebase.json':\n${toDelete
        .map(humanReadable)
        .join("\n")}\n`
    : "";
}
