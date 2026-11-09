import { app } from './app';
import { config } from './config';

const server = app.listen(config.PORT, () => {
  console.log(`ScholarSteps API server running on port ${config.PORT} [DATA_MODE=${config.DATA_MODE}]`);
});

export default server;

