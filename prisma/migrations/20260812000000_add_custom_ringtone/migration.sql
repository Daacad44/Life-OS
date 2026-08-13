-- Custom MP3 ringtone (Global Requirement A — professional alarm).
-- URL of the user's uploaded ringtone in object storage; when set it plays
-- instead of the synthesized preset named by "alarmSound". NULL = use preset.
ALTER TABLE "User" ADD COLUMN "customRingtoneUrl" TEXT;
