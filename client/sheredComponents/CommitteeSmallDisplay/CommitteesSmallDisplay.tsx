import React, { ReactElement, useEffect } from "react";
import { getCommitteeImageFullPath } from "../../utils/db/images";
import SmallDisplay from "../SmallDisplay/SmallDisplay";
import { GetCommitteeDto } from "../../utils/db/committees";

interface Props {
  committee: GetCommitteeDto;
}

export default function CommitteesSmallDisplay({committee }: Props): ReactElement {
  const { imgRef, name, id } = committee;
  const imgPath = imgRef && getCommitteeImageFullPath(imgRef);

  return (
    <SmallDisplay
      href={`/committees/${id}`}
      text={name}
      imgPath={imgPath || ""}
    />
  );
}
