import si from 'systeminformation';

export default defineEventHandler(async () => {
  const cpu = await si.cpu();
  const mem = await si.mem();
  const os = await si.osInfo();

  return {
    cpu,
    mem,
    os,
  };
});
