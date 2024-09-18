import { PartialType } from "@nestjs/swagger";
import { ProfilePayloadDto } from "./create-profile.dto";

export class UpdateProfileDto extends PartialType(ProfilePayloadDto) {}
